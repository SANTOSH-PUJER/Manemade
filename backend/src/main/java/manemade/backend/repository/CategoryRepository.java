package manemade.backend.repository;

import manemade.backend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

    @Query("""
            SELECT DISTINCT c
            FROM Category c
            JOIN Item i ON i.category = c
            WHERE i.isAvailable = true
            ORDER BY c.name
            """)
    List<Category> findCategoriesWithAvailableItems();
}
