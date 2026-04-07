package manemade.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CartResponse {
    private Long id;
    private Long userId;
    private String status;
    private double totalAmount;
    private int totalItems;
    private List<CartLineItem> items;
    private LocalDateTime updatedTs;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public List<CartLineItem> getItems() {
        return items;
    }

    public void setItems(List<CartLineItem> items) {
        this.items = items;
    }

    public LocalDateTime getUpdatedTs() {
        return updatedTs;
    }

    public void setUpdatedTs(LocalDateTime updatedTs) {
        this.updatedTs = updatedTs;
    }

    public static class CartLineItem {
        private Long itemId;
        private String itemName;
        private String itemSlug;
        private String image;
        private String categoryName;
        private double unitPrice;
        private int quantity;
        private double lineTotal;

        public Long getItemId() {
            return itemId;
        }

        public void setItemId(Long itemId) {
            this.itemId = itemId;
        }

        public String getItemName() {
            return itemName;
        }

        public void setItemName(String itemName) {
            this.itemName = itemName;
        }

        public String getItemSlug() {
            return itemSlug;
        }

        public void setItemSlug(String itemSlug) {
            this.itemSlug = itemSlug;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }

        public double getUnitPrice() {
            return unitPrice;
        }

        public void setUnitPrice(double unitPrice) {
            this.unitPrice = unitPrice;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getLineTotal() {
            return lineTotal;
        }

        public void setLineTotal(double lineTotal) {
            this.lineTotal = lineTotal;
        }
    }

}
