package manemade.backend.service;

import manemade.backend.dto.*;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);

    UserResponse login(LoginRequest request);
}
