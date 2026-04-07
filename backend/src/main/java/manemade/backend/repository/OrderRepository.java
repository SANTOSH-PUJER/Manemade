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
    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT o FROM Order o LEFT JOIN FETCH o.user LEFT JOIN FETCH o.address LEFT JOIN FETCH o.items oi LEFT JOIN FETCH oi.item ORDER BY o.createdTs DESC")
    List<Order> findAll();
}
