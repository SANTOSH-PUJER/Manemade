package manemade.backend.dto;

public class AddressResponse {
    private Long id;
    private String line1;
    private String line2;
    private String city;
    private String state;
    private String pincode;
    private boolean isDefault;
    private String recipientName;
    private String recipientPhone;
    private String addressType;

    public AddressResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLine1() { return line1; }
    public void setLine1(String line1) { this.line1 = line1; }

    public String getLine2() { return line2; }
    public void setLine2(String line2) { this.line2 = line2; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public boolean isDefault() { return isDefault; }
    public void setDefault(boolean aDefault) { isDefault = aDefault; }

    public String getRecipientName() { return recipientName; }
    public void setRecipientName(String recipientName) { this.recipientName = recipientName; }

    public String getRecipientPhone() { return recipientPhone; }
    public void setRecipientPhone(String recipientPhone) { this.recipientPhone = recipientPhone; }

    public String getAddressType() { return addressType; }
    public void setAddressType(String addressType) { this.addressType = addressType; }
}
