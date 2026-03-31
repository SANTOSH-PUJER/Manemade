package manemade.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class AddressRequest {
    private Long id;
    
    @NotBlank(message = "Address line 1 is required")
    private String line1;
    
    private String line2;
    
    @NotBlank(message = "City is required")
    private String city;
    
    @NotBlank(message = "State is required")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    private String pincode;
    
    private boolean isDefault;

    public AddressRequest() {}

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
}
