package manemade.backend.dto;


public class ItemResponse {
    private Long id;
    private String itemSlug;
    private String itemName;
    private String shortDescription;
    private String longDescription;
    private double price;
    private String itemImage;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private boolean isAvailable;
    private String quantity;
    private Double attributePrice;

    public ItemResponse() {}

    public ItemResponse(Long id, String itemSlug, String itemName, String shortDescription, String longDescription, double price, String itemImage, Long categoryId, String categoryName, String categorySlug, boolean isAvailable, String quantity, Double attributePrice) {
        this.id = id;
        this.itemSlug = itemSlug;
        this.itemName = itemName;
        this.shortDescription = shortDescription;
        this.longDescription = longDescription;
        this.price = price;
        this.itemImage = itemImage;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.isAvailable = isAvailable;
        this.quantity = quantity;
        this.attributePrice = attributePrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getItemSlug() { return itemSlug; }
    public void setItemSlug(String itemSlug) { this.itemSlug = itemSlug; }
    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }
    public String getShortDescription() { return shortDescription; }
    public void setShortDescription(String shortDescription) { this.shortDescription = shortDescription; }
    public String getLongDescription() { return longDescription; }
    public void setLongDescription(String longDescription) { this.longDescription = longDescription; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getItemImage() { return itemImage; }
    public void setItemImage(String itemImage) { this.itemImage = itemImage; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }
    public Double getAttributePrice() { return attributePrice; }
    public void setAttributePrice(Double attributePrice) { this.attributePrice = attributePrice; }

    public static ItemResponseBuilder builder() {
        return new ItemResponseBuilder();
    }

    public static class ItemResponseBuilder {
        private Long id;
        private String itemSlug;
        private String itemName;
        private String shortDescription;
        private String longDescription;
        private double price;
        private String itemImage;
        private Long categoryId;
        private String categoryName;
        private String categorySlug;
        private boolean isAvailable;
        private String quantity;
        private Double attributePrice;

        public ItemResponseBuilder id(Long id) { this.id = id; return this; }
        public ItemResponseBuilder itemSlug(String itemSlug) { this.itemSlug = itemSlug; return this; }
        public ItemResponseBuilder itemName(String itemName) { this.itemName = itemName; return this; }
        public ItemResponseBuilder shortDescription(String shortDescription) { this.shortDescription = shortDescription; return this; }
        public ItemResponseBuilder longDescription(String longDescription) { this.longDescription = longDescription; return this; }
        public ItemResponseBuilder price(double price) { this.price = price; return this; }
        public ItemResponseBuilder itemImage(String itemImage) { this.itemImage = itemImage; return this; }
        public ItemResponseBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ItemResponseBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public ItemResponseBuilder categorySlug(String categorySlug) { this.categorySlug = categorySlug; return this; }
        public ItemResponseBuilder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public ItemResponseBuilder quantity(String quantity) { this.quantity = quantity; return this; }
        public ItemResponseBuilder attributePrice(Double attributePrice) { this.attributePrice = attributePrice; return this; }

        public ItemResponse build() {
            return new ItemResponse(id, itemSlug, itemName, shortDescription, longDescription, price, itemImage, categoryId, categoryName, categorySlug, isAvailable, quantity, attributePrice);
        }
    }
}
