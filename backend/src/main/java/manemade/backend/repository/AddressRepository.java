package manemade.backend.repository;

import manemade.backend.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    List<Address> findByUserIdAndIsDeletedFalse(Long userId);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.isDeleted = false")
    void clearDefaultAddresses(@Param("userId") Long userId);
}
