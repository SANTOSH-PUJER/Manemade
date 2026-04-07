package manemade.backend.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "addresses", indexes = {
    @Index(name = "idx_address_user", columnList = "user_id")
})
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private User user;

    @Column(nullable = false)
    private String line1;
    private String line2;
    @Column(nullable = false)
    private String city;
    @Column(nullable = false)
    private String state;
    @Column(nullable = false)
    private String pincode;

    @Column(name = "recipient_name")
    private String recipientName;

    @Column(name = "recipient_phone")
    private String recipientPhone;

    @Column(name = "address_type")
    private String addressType; // Home, Work, Other

    @Column(name = "is_default", nullable = false)
    private Boolean isDefault = false;

    @Column(name = "is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @CreationTimestamp
    @Column(name = "created_ts", updatable = false)
    private LocalDateTime createdTs;

    @UpdateTimestamp
    @Column(name = "updated_ts")
    private LocalDateTime updatedTs;

    public Address() {
    }

    public static AddressBuilder builder() {
        return new AddressBuilder();
    }

    public static class AddressBuilder {
        private Address instance = new Address();

        public AddressBuilder user(User user) { instance.setUser(user); return this; }
        public AddressBuilder line1(String line1) { instance.setLine1(line1); return this; }
        public AddressBuilder line2(String line2) { instance.setLine2(line2); return this; }
        public AddressBuilder city(String city) { instance.setCity(city); return this; }
        public AddressBuilder state(String state) { instance.setState(state); return this; }
        public AddressBuilder pincode(String pincode) { instance.setPincode(pincode); return this; }
        public AddressBuilder recipientName(String recipientName) { instance.setRecipientName(recipientName); return this; }
        public AddressBuilder recipientPhone(String recipientPhone) { instance.setRecipientPhone(recipientPhone); return this; }
        public AddressBuilder addressType(String addressType) { instance.setAddressType(addressType); return this; }
        public AddressBuilder isDefault(Boolean isDefault) { instance.setIsDefault(isDefault); return this; }
        public AddressBuilder isDeleted(Boolean isDeleted) { instance.setIsDeleted(isDeleted); return this; }

        public Address build() {
            return instance;
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getLine1() {
        return line1;
    }

    public void setLine1(String line1) {
        this.line1 = line1;
    }

    public String getLine2() {
        return line2;
    }

    public void setLine2(String line2) {
        this.line2 = line2;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getPincode() {
        return pincode;
    }

    public void setPincode(String pincode) {
        this.pincode = pincode;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public String getAddressType() {
        return addressType;
    }

    public void setAddressType(String addressType) {
        this.addressType = addressType;
    }

    public Boolean getIsDefault() {
        return isDefault;
    }

    public void setIsDefault(Boolean isDefault) {
        this.isDefault = isDefault;
    }

    public Boolean getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(Boolean isDeleted) {
        this.isDeleted = isDeleted;
    }
}
