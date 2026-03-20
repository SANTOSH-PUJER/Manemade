package manemade.backend.repository;

import manemade.backend.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Optional<Item> findBySlug(String slug);

    List<Item> findByCategory_Slug(String categorySlug);

    List<Item> findByCategory_Id(Long categoryId);
}
