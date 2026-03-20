package manemade.backend.dto;

public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String image;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String description, String image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.image = image;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public static CategoryResponseBuilder builder() {
        return new CategoryResponseBuilder();
    }

    public static class CategoryResponseBuilder {
        private Long id;
        private String name;
        private String description;
        private String image;

        public CategoryResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CategoryResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public CategoryResponseBuilder description(String description) {
            this.description = description;
            return this;
        }

        public CategoryResponseBuilder image(String image) {
            this.image = image;
            return this;
        }

        public CategoryResponse build() {
            return new CategoryResponse(id, name, description, image);
        }
    }
}
