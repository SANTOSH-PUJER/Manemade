package manemade.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "items", indexes = {
    @Index(name = "idx_item_category", columnList = "category_id"),
    @Index(name = "idx_item_slug", columnList = "item_slug")
})
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "item_slug", nullable = false, unique = true)
    private String itemSlug;

    @Column(name = "short_description")
    private String shortDescription;

    @Column(name = "long_description", length = 2000)
    private String longDescription;

    @Column(name = "item_image")
    private String itemImage;

    @Column(nullable = false)
    private double price;

    @Column(name = "is_available", nullable = false)
    private Boolean isAvailable = true;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

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

    public String getShortDescription() {
        return shortDescription;
    }

    public void setShortDescription(String shortDescription) {
        this.shortDescription = shortDescription;
    }

    public String getLongDescription() {
        return longDescription;
    }

    public void setLongDescription(String longDescription) {
        this.longDescription = longDescription;
    }

    public String getItemImage() {
        return itemImage;
    }

    public void setItemImage(String itemImage) {
        this.itemImage = itemImage;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public static class ItemBuilder {
        private Item instance = new Item();

        public ItemBuilder itemName(String itemName) {
            instance.setItemName(itemName);
            return this;
        }

        public ItemBuilder itemSlug(String itemSlug) {
            instance.setItemSlug(itemSlug);
            return this;
        }

        public ItemBuilder shortDescription(String shortDescription) {
            instance.setShortDescription(shortDescription);
            return this;
        }

        public ItemBuilder longDescription(String longDescription) {
            instance.setLongDescription(longDescription);
            return this;
        }

        public ItemBuilder itemImage(String itemImage) {
            instance.setItemImage(itemImage);
            return this;
        }

        public ItemBuilder price(double price) {
            instance.setPrice(price);
            return this;
        }

        public ItemBuilder isAvailable(Boolean isAvailable) {
            instance.setIsAvailable(isAvailable);
            return this;
        }

        public ItemBuilder isDeleted(Boolean isDeleted) {
            instance.setIsDeleted(isDeleted);
            return this;
        }

        public ItemBuilder category(Category category) {
            instance.setCategory(category);
            return this;
        }

        public Item build() {
            return instance;
        }
    }
}
