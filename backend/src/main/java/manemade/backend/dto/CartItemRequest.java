package manemade.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CartItemRequest {
    @NotNull(message = "Item id is required")
    private Long itemId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;

    public Long getItemId() {
        return itemId;
    }

    public void setItemId(Long itemId) {
        this.itemId = itemId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }
}
