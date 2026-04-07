package manemade.backend.repository;

import manemade.backend.entity.UserAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAnalyticsRepository extends JpaRepository<UserAnalytics, Long> {
    Optional<UserAnalytics> findByUserId(Long userId);
    Optional<UserAnalytics> findTopByUserIdOrderByEventTsDesc(Long userId);
    List<UserAnalytics> findByUserIdOrderByEventTsDesc(Long userId);
}
