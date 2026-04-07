package manemade.backend.repository;

import manemade.backend.entity.ItemAttributes;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ItemAttributesRepository extends JpaRepository<ItemAttributes, Long> {
    Optional<ItemAttributes> findByItemId(Long itemId);
}
