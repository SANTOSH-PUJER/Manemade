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
    Optional<Item> findByItemSlugAndIsAvailableTrue(String slug);

    Optional<Item> findByItemSlug(String itemSlug);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByCategory_SlugAndIsAvailableTrueAndIsDeletedFalse(String categorySlug);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByCategory_IdAndIsAvailableTrueAndIsDeletedFalse(Long categoryId);

    @EntityGraph(attributePaths = {"category"})
    @Query("SELECT i FROM Item i WHERE i.isAvailable = true AND i.isDeleted = false AND (LOWER(i.itemName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(i.shortDescription) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Item> searchItems(@Param("query") String query);

    @EntityGraph(attributePaths = {"category"})
    List<Item> findByIsAvailableTrueAndIsDeletedFalse();

    @Override
    @EntityGraph(attributePaths = {"category"})
    List<Item> findAll();
}
