package manemade.backend.service;

import manemade.backend.dto.*;
import manemade.backend.entity.Otp;
import manemade.backend.entity.User;
import manemade.backend.entity.UserAnalytics;
import manemade.backend.repository.OtpRepository;
import manemade.backend.repository.UserAnalyticsRepository;
import manemade.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger log = LoggerFactory.getLogger(UserServiceImpl.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final OtpRepository otpRepository;
    private final UserAnalyticsRepository userAnalyticsRepository;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepository, 
                           PasswordEncoder passwordEncoder, 
                           OtpRepository otpRepository, 
                           UserAnalyticsRepository userAnalyticsRepository,
                           JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpRepository = otpRepository;
        this.userAnalyticsRepository = userAnalyticsRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public AuthResponse registerUser(UserRegistrationRequest request) {
        log.info("Registering user with email: {}", request.getEmail());
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .mobileNumber(request.getMobileNumber())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getId());
        
        String token = jwtService.generateToken(savedUser);
        return AuthResponse.builder()
                .token(token)
                .user(mapToResponse(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        User user = userRepository.findByEmail(request.getUsername())
                .or(() -> userRepository.findByMobileNumber(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        recordAnalytics(user.getId(), "WEB", "DESKTOP", "UNKNOWN");
        
        String token = jwtService.generateToken(user);
        return AuthResponse.builder()
                .token(token)
                .user(mapToResponse(user))
                .build();
    }

    @Override
    public UserResponse getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        if (!user.getMobileNumber().equals(request.getMobileNumber()) && userRepository.existsByMobileNumber(request.getMobileNumber())) {
            throw new RuntimeException("Mobile number already registered");
        }

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        log.info("Changing password for user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void generateOtp(String email) {
        log.info("Generating OTP for email: {}", email);
        if (!userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email not registered");
        }

        String otpValue = String.valueOf((int) (Math.random() * 900000) + 100000);
        Otp otp = new Otp(email, otpValue, LocalDateTime.now().plusMinutes(5));
        
        otpRepository.deleteByEmail(email);
        otpRepository.save(otp);
        log.info("OTP for {}: {}", email, otpValue);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        log.info("Verifying OTP for email: {}", email);
        return otpRepository.findTopByEmailOrderByCreatedTsDesc(email)
                .map(o -> o.getOtp().equals(otp) && o.getExpiryTs().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());
        if (!verifyOtp(request.getEmail(), request.getOtp())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.getEmail());
    }

    @Override
    @Transactional
    public void recordAnalytics(Long userId, String platform, String device, String location) {
        User user = userRepository.findById(userId).orElse(null);
        if (user != null) {
            UserAnalytics analytics = userAnalyticsRepository.findByUserId(userId)
                    .orElse(new UserAnalytics());
            
            analytics.setUser(user);
            analytics.setPlatform(platform);
            analytics.setDevice(device);
            analytics.setLocation(location);
            userAnalyticsRepository.save(analytics);
        }
    }

    private UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .build();
    }
}
