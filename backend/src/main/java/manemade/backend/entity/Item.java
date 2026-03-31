package manemade.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(nullable = false)
    private double price;

    @Column(name = "is_veg", nullable = false)
    private boolean isVeg = true;

    @Column(name = "spice_level")
    private int spiceLevel = 1;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    @CreationTimestamp
    @Column(name = "created_ts", updatable = false)
    private LocalDateTime createdTs;

    @UpdateTimestamp
    @Column(name = "updated_ts")
    private LocalDateTime updatedTs;

    public Item() {
    }

    public static ItemBuilder builder() {
        return new ItemBuilder();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public boolean isVeg() { return isVeg; }
    public void setVeg(boolean veg) { isVeg = veg; }
    public int getSpiceLevel() { return spiceLevel; }
    public void setSpiceLevel(int spiceLevel) { this.spiceLevel = spiceLevel; }
    public boolean isAvailable() { return isAvailable; }
    public void setAvailable(boolean available) { isAvailable = available; }

    public static class ItemBuilder {
        private Item instance = new Item();

        public ItemBuilder name(String name) {
            instance.setName(name);
            return this;
        }

        public ItemBuilder slug(String slug) {
            instance.setSlug(slug);
            return this;
        }

        public ItemBuilder description(String description) {
            instance.setDescription(description);
            return this;
        }

        public ItemBuilder imageUrl(String imageUrl) {
            instance.setImageUrl(imageUrl);
            return this;
        }

        public ItemBuilder price(double price) {
            instance.setPrice(price);
            return this;
        }

        public ItemBuilder category(Category category) {
            instance.setCategory(category);
            return this;
        }

        public ItemBuilder isVeg(boolean isVeg) {
            instance.setVeg(isVeg);
            return this;
        }

        public ItemBuilder spiceLevel(int spiceLevel) {
            instance.setSpiceLevel(spiceLevel);
            return this;
        }

        public ItemBuilder isAvailable(boolean isAvailable) {
            instance.setAvailable(isAvailable);
            return this;
        }

        public Item build() {
            return instance;
        }
    }
}
