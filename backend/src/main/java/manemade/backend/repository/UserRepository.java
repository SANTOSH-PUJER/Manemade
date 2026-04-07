package manemade.backend.repository;

import manemade.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.email = :email")
    Optional<User> findByEmailWithAddresses(String email);

    Optional<User> findByEmail(String email);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.mobileNumber = :mobileNumber")
    Optional<User> findByMobileNumberWithAddresses(String mobileNumber);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT u FROM User u LEFT JOIN FETCH u.addresses WHERE u.id = :id")
    Optional<User> findByIdWithAddresses(Long id);

    Optional<User> findByMobileNumber(String mobileNumber);

    @Override
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"addresses"})
    List<User> findAll();

    boolean existsByEmail(String email);

    boolean existsByMobileNumber(String mobileNumber);
}
