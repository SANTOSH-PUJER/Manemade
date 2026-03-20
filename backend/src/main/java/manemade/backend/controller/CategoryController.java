package manemade.backend.controller;

import manemade.backend.dto.CategoryResponse;
import manemade.backend.entity.Category;
import manemade.backend.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CategoryController {
    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<CategoryResponse>> getAll() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }

    @PostMapping("/create")
    public ResponseEntity<CategoryResponse> create(@RequestBody Category category) {
        return ResponseEntity.ok(categoryService.createCategory(category));
    }
}
