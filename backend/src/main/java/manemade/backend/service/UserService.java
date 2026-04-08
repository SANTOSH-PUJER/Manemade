package manemade.backend.service;

import manemade.backend.dto.*;
import java.util.Map;

public interface UserService {
    AuthResponse registerUser(UserRegistrationRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void changePassword(Long id, ChangePasswordRequest request);

    Map<String, String> generateOtp(String identifier);

    boolean verifyOtp(String identifier, String otp);

    AuthResponse loginWithOtp(String identifier, String otp);

    void resetPassword(ResetPasswordRequest request);
    
    void recordAnalytics(Long userId, String platform, String device, String location);
    
    UserResponse getMe(String email);
    
    UserResponse mapToResponse(manemade.backend.entity.User user);
}
