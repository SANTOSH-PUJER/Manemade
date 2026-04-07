package manemade.backend.controller;

import jakarta.validation.Valid;
import manemade.backend.dto.CartItemRequest;
import manemade.backend.dto.CartResponse;
import manemade.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponse> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getActiveCart(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<CartResponse> addItem(@Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(cartService.addItem(request.getUserId(), request));
    }

    @PutMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponse> updateItem(
            @PathVariable Long userId,
            @PathVariable Long itemId,
            @Valid @RequestBody CartItemRequest request
    ) {
        return ResponseEntity.ok(cartService.updateItem(userId, itemId, request));
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long userId, @PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(userId, itemId));
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<CartResponse> clearCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.clearCart(userId));
    }
}
