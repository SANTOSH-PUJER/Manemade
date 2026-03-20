package manemade.backend.dto;

public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String mobileNumber;

    public UserResponse() {}

    public UserResponse(Long id, String firstName, String lastName, String email, String mobileNumber) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.mobileNumber = mobileNumber;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String mobileNumber;

        public UserResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserResponseBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public UserResponseBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public UserResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserResponseBuilder mobileNumber(String mobileNumber) {
            this.mobileNumber = mobileNumber;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(id, firstName, lastName, email, mobileNumber);
        }
    }
}
