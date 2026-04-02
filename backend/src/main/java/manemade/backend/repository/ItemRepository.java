package manemade.backend.repository;

import manemade.backend.entity.Item;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    @EntityGraph(attributePaths = {"category"})
    Optional<Item> findBySlugAndIsAvailableTrue(String slug);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByCategory_SlugAndIsAvailableTrue(String categorySlug);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByCategory_IdAndIsAvailableTrue(Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT i FROM Item i WHERE i.isAvailable = true AND (LOWER(i.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Item> searchItems(@Param("query") String query);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByIsAvailableTrue();

    @Override
    @EntityGraph(attributePaths = {"category"})
    List<Item> findAll();
}
