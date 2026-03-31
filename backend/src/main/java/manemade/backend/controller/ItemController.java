package manemade.backend.controller;

import manemade.backend.dto.ItemResponse;
import manemade.backend.entity.Item;
import manemade.backend.service.ItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
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

    @GetMapping("/all")
    public ResponseEntity<List<ItemResponse>> getAll() {
        return ResponseEntity.ok(itemService.getAllItems());
    }

    @PostMapping("/create")
    public ResponseEntity<ItemResponse> create(@RequestBody Item item) {
        return ResponseEntity.ok(itemService.createItem(item));
    }
}
