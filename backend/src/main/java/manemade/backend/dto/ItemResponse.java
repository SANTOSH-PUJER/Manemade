package manemade.backend.dto;

import java.util.List;

public class ItemResponse {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private double price;
    private String image;
    private Long categoryId;
    private String categoryName;
    private String categorySlug;
    private double rating;
    private int reviewCount;
    private boolean isVeg;
    private int spiceLevel;
    private boolean isAvailable;
    private int deliveryTimeMinutes;
    private List<String> ingredients;
    private List<String> tags;
    private String highlight;

    public ItemResponse() {}

    public ItemResponse(Long id, String slug, String name, String description, double price, String image, Long categoryId, String categoryName, String categorySlug, double rating, int reviewCount, boolean isVeg, int spiceLevel, boolean isAvailable, int deliveryTimeMinutes, List<String> ingredients, List<String> tags, String highlight) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.description = description;
        this.price = price;
        this.image = image;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categorySlug = categorySlug;
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.isVeg = isVeg;
        this.spiceLevel = spiceLevel;
        this.isAvailable = isAvailable;
        this.deliveryTimeMinutes = deliveryTimeMinutes;
        this.ingredients = ingredients;
        this.tags = tags;
        this.highlight = highlight;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
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
    public String getCategorySlug() { return categorySlug; }
    public void setCategorySlug(String categorySlug) { this.categorySlug = categorySlug; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { isVeg = veg; }
    public int getSpiceLevel() { return spiceLevel; }
    public void setSpiceLevel(int spiceLevel) { this.spiceLevel = spiceLevel; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }
    public int getDeliveryTimeMinutes() { return deliveryTimeMinutes; }
    public void setDeliveryTimeMinutes(int deliveryTimeMinutes) { this.deliveryTimeMinutes = deliveryTimeMinutes; }
    public List<String> getIngredients() { return ingredients; }
    public void setIngredients(List<String> ingredients) { this.ingredients = ingredients; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }
    public String getHighlight() { return highlight; }
    public void setHighlight(String highlight) { this.highlight = highlight; }

    public static ItemResponseBuilder builder() {
        return new ItemResponseBuilder();
    }

    public static class ItemResponseBuilder {
        private Long id;
        private String slug;
        private String name;
        private String description;
        private double price;
        private String image;
        private Long categoryId;
        private String categoryName;
        private String categorySlug;
        private double rating;
        private int reviewCount;
        private boolean isVeg;
        private int spiceLevel;
        private boolean isAvailable;
        private int deliveryTimeMinutes;
        private List<String> ingredients;
        private List<String> tags;
        private String highlight;

        public ItemResponseBuilder id(Long id) { this.id = id; return this; }
        public ItemResponseBuilder slug(String slug) { this.slug = slug; return this; }
        public ItemResponseBuilder name(String name) { this.name = name; return this; }
        public ItemResponseBuilder description(String description) { this.description = description; return this; }
        public ItemResponseBuilder price(double price) { this.price = price; return this; }
        public ItemResponseBuilder image(String image) { this.image = image; return this; }
        public ItemResponseBuilder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public ItemResponseBuilder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public ItemResponseBuilder categorySlug(String categorySlug) { this.categorySlug = categorySlug; return this; }
        public ItemResponseBuilder rating(double rating) { this.rating = rating; return this; }
        public ItemResponseBuilder reviewCount(int reviewCount) { this.reviewCount = reviewCount; return this; }
        public ItemResponseBuilder isVeg(boolean isVeg) { this.isVeg = isVeg; return this; }
        public ItemResponseBuilder spiceLevel(int spiceLevel) { this.spiceLevel = spiceLevel; return this; }
        public ItemResponseBuilder isAvailable(boolean isAvailable) { this.isAvailable = isAvailable; return this; }
        public ItemResponseBuilder deliveryTimeMinutes(int deliveryTimeMinutes) { this.deliveryTimeMinutes = deliveryTimeMinutes; return this; }
        public ItemResponseBuilder ingredients(List<String> ingredients) { this.ingredients = ingredients; return this; }
        public ItemResponseBuilder tags(List<String> tags) { this.tags = tags; return this; }
        public ItemResponseBuilder highlight(String highlight) { this.highlight = highlight; return this; }

        public ItemResponse build() {
            return new ItemResponse(id, slug, name, description, price, image, categoryId, categoryName, categorySlug, rating, reviewCount, isVeg, spiceLevel, isAvailable, deliveryTimeMinutes, ingredients, tags, highlight);
        }
    }
}
