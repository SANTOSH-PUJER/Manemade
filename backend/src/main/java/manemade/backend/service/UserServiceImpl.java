package manemade.backend.service;

import manemade.backend.dto.AuthResponse;
import manemade.backend.dto.ChangePasswordRequest;
import manemade.backend.dto.LoginRequest;
import manemade.backend.dto.ResetPasswordRequest;
import manemade.backend.dto.UpdateUserRequest;
import manemade.backend.dto.UserRegistrationRequest;
import manemade.backend.dto.UserResponse;
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

import java.util.Map;
import java.time.LocalDateTime;

@Service
@Transactional
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
                .role("USER")
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getId());

        // Establish session authentication
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        savedUser.getEmail(), null, savedUser.getAuthorities());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authToken);

        String token = jwtService.generateToken(savedUser);
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(mapToResponse(savedUser));
        return response;
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for user: {}", request.getUsername());
        User user = userRepository.findByEmailWithAddresses(request.getUsername())
                .or(() -> userRepository.findByMobileNumberWithAddresses(request.getUsername()))
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found - {}", request.getUsername());
                    return new RuntimeException("User not found");
                });



        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed: Invalid credentials for user - {}", request.getUsername());
            throw new RuntimeException("Invalid credentials");
        }

        try {
            recordAnalytics(user.getId(), "WEB", "DESKTOP", "UNKNOWN");
        } catch (Exception e) {
            log.error("Failed to record analytics for user {}: {}", user.getId(), e.getMessage());
            // Don't fail login if analytics recording fails
        }

        // Establish session authentication
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, user.getAuthorities());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authToken);

        String token = jwtService.generateToken(user);
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(mapToResponse(user));
        return response;
    }

    @Override
    public UserResponse getUserById(Long id) {
        log.info("Fetching user with id: {}", id);
        User user = userRepository.findByIdWithAddresses(id).orElseThrow(() -> new RuntimeException("User not found"));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        log.info("Updating user with id: {}", id);
        User user = userRepository.findByIdWithAddresses(id).orElseThrow(() -> new RuntimeException("User not found"));

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
        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        User updatedUser = userRepository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    @Transactional
    public void changePassword(Long id, ChangePasswordRequest request) {
        log.info("Changing password for user with id: {}", id);
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public Map<String, String> generateOtp(String identifier) {
        log.info("Generating OTP for email: {}", identifier);
        User user = userRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + identifier));

        String otpValue = String.valueOf((int) (Math.random() * 900000) + 100000);
        Otp otp = new Otp(user.getEmail(), otpValue, LocalDateTime.now().plusMinutes(5));

        otpRepository.deleteByEmail(user.getEmail());
        otpRepository.save(otp);
        log.info("OTP for {}: {}", user.getEmail(), otpValue);
        
        return Map.of("otp", otpValue, "email", user.getEmail());
    }

    @Override
    public boolean verifyOtp(String identifier, String otp) {
        log.info("Verifying OTP for email: {}", identifier);
        return otpRepository.findTopByEmailOrderByCreatedTsDesc(identifier)
                .map(o -> o.getOtp().equals(otp) && o.getExpiryTs().isAfter(LocalDateTime.now()))
                .orElse(false);
    }

    @Override
    @Transactional
    public AuthResponse loginWithOtp(String identifier, String otp) {
        log.info("OTP Login attempt for email: {}", identifier);
        if (!verifyOtp(identifier, otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(identifier)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Establish session authentication
        org.springframework.security.authentication.UsernamePasswordAuthenticationToken authToken = 
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, user.getAuthorities());
        org.springframework.security.core.context.SecurityContextHolder.getContext().setAuthentication(authToken);

        String token = jwtService.generateToken(user);
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUser(mapToResponse(user));
        
        // Cleanup OTP
        otpRepository.deleteByEmail(user.getEmail());
        
        return response;
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Resetting password for email: {}", request.getEmail());
        if (!verifyOtp(request.getEmail(), request.getOtp())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpRepository.deleteByEmail(request.getEmail());
    }

    @Override
    @Transactional
    public void recordAnalytics(Long userId, String platform, String device, String location) {
        try {
            User user = userRepository.findById(userId).orElse(null);
            if (user != null) {
                UserAnalytics analytics = userAnalyticsRepository.findTopByUserIdOrderByEventTsDesc(userId).orElse(new UserAnalytics());
                analytics.setUser(user);
                analytics.setPlatform(platform);
                analytics.setDevice(device);
                analytics.setLocation(location);
                userAnalyticsRepository.save(analytics);
                log.info("Analytics recorded for user: {}", userId);
            }
        } catch (Exception e) {
            log.error("Error recording user analytics: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    @Override
    public UserResponse getMe(String email) {
        log.info("Fetching /me profile for user: {}", email);
        User user = userRepository.findByEmailWithAddresses(email)
                .orElseThrow(() -> {
                    log.error("User not found: {}", email);
                    return new RuntimeException("User not found");
                });
        

        
        return mapToResponse(user);
    }

    @Override
    public UserResponse mapToResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole())
                .addresses(user.getAddresses() != null ? user.getAddresses().stream()
                        .filter(a -> !a.getIsDeleted())
                        .map(this::mapAddressToResponse)
                        .collect(java.util.stream.Collectors.toList()) : java.util.Collections.emptyList())
                .build();
    }

    private manemade.backend.dto.AddressResponse mapAddressToResponse(manemade.backend.entity.Address address) {
        manemade.backend.dto.AddressResponse response = new manemade.backend.dto.AddressResponse();
        response.setId(address.getId());
        response.setLine1(address.getLine1());
        response.setLine2(address.getLine2());
        response.setCity(address.getCity());
        response.setState(address.getState());
        response.setPincode(address.getPincode());
        response.setDefault(address.getIsDefault());
        response.setRecipientName(address.getRecipientName());
        response.setRecipientPhone(address.getRecipientPhone());
        response.setAddressType(address.getAddressType());
        return response;
    }
}
