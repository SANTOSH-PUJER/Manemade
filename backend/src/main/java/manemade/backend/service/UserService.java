package manemade.backend.service;

import manemade.backend.dto.*;

public interface UserService {
    AuthResponse registerUser(UserRegistrationRequest request);

    AuthResponse login(LoginRequest request);

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    void changePassword(Long id, ChangePasswordRequest request);

    void generateOtp(String email);

    boolean verifyOtp(String email, String otp);

    void resetPassword(ResetPasswordRequest request);
    
    void recordAnalytics(Long userId, String platform, String device, String location);
}
