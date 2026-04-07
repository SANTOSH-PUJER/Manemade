package manemade.backend.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import manemade.backend.dto.*;
import manemade.backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    private final UserService userService;
    private final UserDetailsService userDetailsService;
    private final SecurityContextRepository securityContextRepository = new HttpSessionSecurityContextRepository();
    
    public UserController(UserService userService, UserDetailsService userDetailsService) {
        this.userService = userService;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody UserRegistrationRequest request, 
                                                 HttpServletRequest httpRequest, 
                                                 HttpServletResponse httpResponse) {
        log.info("User registration requested for email: {}", request.getEmail());
        AuthResponse response = userService.registerUser(request);
        
        // Establish Session & Security Context
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);
        
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", response.getUser().getId());
        
        log.info("User registered successfully and session created: {}", response.getUser().getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request, 
                                              HttpServletRequest httpRequest,
                                              HttpServletResponse httpResponse) {
        log.info("User login requested for username: {}", request.getUsername());
        AuthResponse response = userService.login(request);
        
        // Establish Session & Security Context
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        var authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        var context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);
        
        HttpSession session = httpRequest.getSession(true);
        session.setAttribute("userId", response.getUser().getId());
        
        log.info("User logged in successfully and session created: {}", response.getUser().getId());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate-otp")
    public ResponseEntity<Void> generateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        log.info("OTP generation requested for email: {}", email);
        userService.generateOtp(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        log.info("OTP verification requested for email: {}", email);
        boolean isValid = userService.verifyOtp(email, otp);
        return ResponseEntity.ok(isValid);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Password reset requested for email: {}", request.getEmail());
        userService.resetPassword(request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        log.info("Fetching user profile for id: {}", id);
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UpdateUserRequest request) {
        log.info("Updating user profile for id: {}", id);
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            log.warn("Unauthorized attempt to access /me endpoint");
            return ResponseEntity.status(401).build();
        }
        
        String email = authentication.getName();
        try {
            return ResponseEntity.ok(userService.getMe(email));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).build();
        }
    }
}
