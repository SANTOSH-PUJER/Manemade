package manemade.backend.repository;

import manemade.backend.entity.Order;
import manemade.backend.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @EntityGraph(attributePaths = {"user", "address", "items", "items.item"})
    List<Order> findByUserOrderByCreatedTsDesc(User user);

    @Override
    @EntityGraph(attributePaths = {"user", "address", "items", "items.item"})
    List<Order> findAll();
}
