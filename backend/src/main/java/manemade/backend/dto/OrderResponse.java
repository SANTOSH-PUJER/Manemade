package manemade.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponse {
    private Long id;
    private Long userId;
    private Long addressId;
    private double totalAmount;
    private String status;
    private String paymentMode;
    private String paymentStatus;
    private Long paymentId;
    private String transactionId;
    private List<OrderItemResponse> items;
    private LocalDateTime createdTs;

    public OrderResponse() {}

    public static OrderResponseBuilder builder() {
        return new OrderResponseBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getAddressId() { return addressId; }
    public void setAddressId(Long addressId) { this.addressId = addressId; }
    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentMode() { return paymentMode; }
    public void setPaymentMode(String paymentMode) { this.paymentMode = paymentMode; }
    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    public List<OrderItemResponse> getItems() { return items; }
    public void setItems(List<OrderItemResponse> items) { this.items = items; }
    public LocalDateTime getCreatedTs() { return createdTs; }
    public void setCreatedTs(LocalDateTime createdTs) { this.createdTs = createdTs; }

    public static class OrderItemResponse {
        private Long itemId;
        private String itemName;
        private int quantity;
        private double price;

        public OrderItemResponse() {}

        public static OrderItemResponseBuilder builder() {
            return new OrderItemResponseBuilder();
        }

        // Getters and Setters
        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public String getItemName() { return itemName; }
        public void setItemName(String itemName) { this.itemName = itemName; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public double getPrice() { return price; }
        public void setPrice(double price) { this.price = price; }

        public static class OrderItemResponseBuilder {
            private OrderItemResponse instance = new OrderItemResponse();
            public OrderItemResponseBuilder itemId(Long itemId) { instance.setItemId(itemId); return this; }
            public OrderItemResponseBuilder itemName(String itemName) { instance.setItemName(itemName); return this; }
            public OrderItemResponseBuilder quantity(int quantity) { instance.setQuantity(quantity); return this; }
            public OrderItemResponseBuilder price(double price) { instance.setPrice(price); return this; }
            public OrderItemResponse build() { return instance; }
        }
    }

    public static class OrderResponseBuilder {
        private OrderResponse instance = new OrderResponse();
        public OrderResponseBuilder id(Long id) { instance.setId(id); return this; }
        public OrderResponseBuilder userId(Long userId) { instance.setUserId(userId); return this; }
        public OrderResponseBuilder addressId(Long addressId) { instance.setAddressId(addressId); return this; }
        public OrderResponseBuilder totalAmount(double totalAmount) { instance.setTotalAmount(totalAmount); return this; }
        public OrderResponseBuilder status(String status) { instance.setStatus(status); return this; }
        public OrderResponseBuilder paymentMode(String paymentMode) { instance.setPaymentMode(paymentMode); return this; }
        public OrderResponseBuilder paymentStatus(String paymentStatus) { instance.setPaymentStatus(paymentStatus); return this; }
        public OrderResponseBuilder paymentId(Long paymentId) { instance.setPaymentId(paymentId); return this; }
        public OrderResponseBuilder transactionId(String transactionId) { instance.setTransactionId(transactionId); return this; }
        public OrderResponseBuilder items(List<OrderItemResponse> items) { instance.setItems(items); return this; }
        public OrderResponseBuilder createdTs(LocalDateTime createdTs) { instance.setCreatedTs(createdTs); return this; }
        public OrderResponse build() { return instance; }
    }
}
