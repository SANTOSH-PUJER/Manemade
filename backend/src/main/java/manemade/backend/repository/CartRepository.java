package manemade.backend.repository;

import manemade.backend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.item"})
    Optional<Cart> findByUserIdAndStatus(Long userId, String status);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"items", "items.item"})
    List<Cart> findByUserIdOrderByUpdatedTsDesc(Long userId);
}
