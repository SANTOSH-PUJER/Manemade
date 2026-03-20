package manemade.backend.service;

import manemade.backend.dto.CategoryResponse;
import manemade.backend.repository.CategoryRepository;
import manemade.backend.entity.Category;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
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
                .name(category.getName())
                .description(category.getSlug()) // Using slug as description for now if no desc field exists
                .image(null) // Placeholder for image
                .build();
    }
}
