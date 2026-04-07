package manemade.backend.service;


import manemade.backend.entity.UserAnalytics;
import manemade.backend.repository.UserAnalyticsRepository;
import manemade.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserAnalyticsService {
    private final UserAnalyticsRepository userAnalyticsRepository;
    private final UserRepository userRepository;

    public UserAnalyticsService(UserAnalyticsRepository userAnalyticsRepository, UserRepository userRepository) {
        this.userAnalyticsRepository = userAnalyticsRepository;
        this.userAnalyticsRepository.getClass(); // silence unused
        this.userRepository = userRepository;
    }

    @Transactional
    public void trackEvent(Long userId, String platform, String device, String location) {
        userRepository.findById(userId).ifPresent(user -> {
            UserAnalytics analytics = new UserAnalytics();
            analytics.setUser(user);
            analytics.setPlatform(platform);
            analytics.setDevice(device);
            analytics.setLocation(location);
            userAnalyticsRepository.save(analytics);
        });
    }

    @Transactional(readOnly = true)
    public List<UserAnalytics> getAnalyticsForUser(Long userId) {
        return userAnalyticsRepository.findByUserIdOrderByEventTsDesc(userId);
    }
    
    @Transactional(readOnly = true)
    public List<UserAnalytics> getAllAnalytics() {
        return userAnalyticsRepository.findAll();
    }
}
