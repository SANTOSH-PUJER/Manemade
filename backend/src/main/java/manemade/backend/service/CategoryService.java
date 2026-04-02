package manemade.backend.service;

import manemade.backend.dto.CategoryResponse;
import manemade.backend.repository.CategoryRepository;
import manemade.backend.entity.Category;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findCategoriesWithAvailableItems().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse createCategory(Category category) {
        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .slug(category.getSlug())
                .name(category.getName())
                .description(category.getDescription())
                .image(category.getImageUrl())
                .build();
    }
}
