package manemade.backend.repository;

import manemade.backend.entity.Otp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<Otp, Long> {
    Optional<Otp> findTopByEmailOrderByCreatedTsDesc(String email);
    void deleteByEmail(String email);
}
