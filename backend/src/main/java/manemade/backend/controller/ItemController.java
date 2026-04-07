package manemade.backend.controller;

import manemade.backend.dto.ItemResponse;
import manemade.backend.entity.Item;
import manemade.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = { "http://localhost:5173", "http://localhost:5174" })
public class ItemController {
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ItemResponse>> getByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(itemService.getItemsByCategoryId(categoryId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ItemResponse>> search(@RequestParam String q) {
        return ResponseEntity.ok(itemService.searchItems(q));
    }

    @GetMapping
    public ResponseEntity<List<ItemResponse>> getAll(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(itemService.getItemsByCategory(category));
        }
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ItemResponse> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(itemService.getItemBySlug(slug));
    }

    @PostMapping("/create")
    public ResponseEntity<ItemResponse> create(@RequestBody Item item) {
        return ResponseEntity.ok(itemService.createItem(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ItemResponse> update(@PathVariable Long id, @RequestBody Item item) {
        return ResponseEntity.ok(itemService.updateItem(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.ok().build();
    }
}
