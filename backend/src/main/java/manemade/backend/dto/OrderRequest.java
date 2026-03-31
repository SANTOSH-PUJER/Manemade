package manemade.backend.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class OrderRequest {
    @NotNull(message = "User id is required")
    private Long userId;

    @NotNull(message = "Address id is required")
    private Long addressId;

    @NotEmpty(message = "At least one order item is required")
    @Valid
    private List<OrderItemRequest> items;

    public OrderRequest() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }

    public List<OrderItemRequest> getItems() { return items; }
    public void setItems(List<OrderItemRequest> items) { this.items = items; }

    public static class OrderItemRequest {
        @NotNull(message = "Item id is required")
        private Long itemId;

        @Min(value = 1, message = "Quantity must be at least 1")
        private int quantity;

        public OrderItemRequest() {}

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
    }
}
