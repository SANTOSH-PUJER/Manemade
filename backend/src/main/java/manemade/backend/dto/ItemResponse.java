package manemade.backend.dto;

public class ItemResponse {
    private Long id;
    private String name;
    private String description;
    private double price;
    private String image;
    private Long categoryId;
    private String categoryName;
    private boolean isVeg;
    private int spiceLevel;
    private boolean isAvailable;

    public ItemResponse() {}

    public ItemResponse(Long id, String name, String description, double price, String image, Long categoryId, String categoryName, boolean isVeg, int spiceLevel, boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.isVeg = isVeg;
        this.spiceLevel = spiceLevel;
        this.isAvailable = isAvailable;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { isVeg = veg; }
    public int getSpiceLevel() { return spiceLevel; }
    public void setSpiceLevel(int spiceLevel) { this.spiceLevel = spiceLevel; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public static ItemResponseBuilder builder() {
        return new ItemResponseBuilder();
    }

    public static class ItemResponseBuilder {
        private Long id;
        private String name;
        private String description;
        private double price;
        private String image;
        private Long categoryId;
        private String categoryName;
        private boolean isVeg;
        private int spiceLevel;
        private boolean isAvailable;

        public ItemResponseBuilder id(Long id) { this.id = id; return this; }
        public ItemResponseBuilder name(String name) { this.name = name; return this; }
        public ItemResponseBuilder description(String description) { this.description = description; return this; }
        public ItemResponseBuilder price(double price) { this.price = price; return this; }
        public ItemResponseBuilder image(String image) { this.image = image; return this; }
        public ItemResponseBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ItemResponseBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public ItemResponseBuilder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public ItemResponseBuilder spiceLevel(int spiceLevel) { this.spiceLevel = spiceLevel; return this; }
        public ItemResponseBuilder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }

        public ItemResponse build() {
            return new ItemResponse(id, name, description, price, image, categoryId, categoryName, isVeg, spiceLevel, isAvailable);
        }
    }
}
