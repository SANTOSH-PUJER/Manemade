package manemade.backend.config;

import manemade.backend.entity.Address;
import manemade.backend.entity.Category;
import manemade.backend.entity.Item;
import manemade.backend.entity.User;
import manemade.backend.repository.AddressRepository;
import manemade.backend.repository.CategoryRepository;
import manemade.backend.repository.ItemRepository;
import manemade.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            CategoryRepository categoryRepository,
            ItemRepository itemRepository,
            UserRepository userRepository,
            AddressRepository addressRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            User defaultUser = userRepository.findByEmail("santosh@example.com").orElseGet(() -> {
                User user = User.builder()
                        .firstName("Santosh")
                        .lastName("Pujer")
                        .email("santosh@example.com")
                        .mobileNumber("9876543210")
                        .password(passwordEncoder.encode("password123"))
                        .build();
                return userRepository.save(user);
            });

            if (addressRepository.findByUserIdAndIsDeletedFalse(defaultUser.getId()).isEmpty()) {
                Address address = new Address();
                address.setUser(defaultUser);
                address.setLine1("1st Block, Rajajinagar");
                address.setCity("Bengaluru");
                address.setState("Karnataka");
                address.setPincode("560010");
                address.setDefault(true);
                addressRepository.save(address);
            }

            Map<String, Category> categories = ensureCategories(categoryRepository);
            ensureItems(itemRepository, categories);
        };
    }

    private Map<String, Category> ensureCategories(CategoryRepository categoryRepository) {
        List<Category> requiredCategories = List.of(
                category("Jolada Rotti", "jolada-rotti", "Hand-pressed jowar rotis served the homemade way with regional comfort.", "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80"),
                category("Ennegayi", "ennegayi", "Stuffed brinjal classics slow-cooked with groundnut and sesame masala.", "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80"),
                category("Chutney", "chutney", "Freshly ground podis and chutneys that make every bite feel homemade.", "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=80"),
                category("Snacks", "snacks", "Simple, spicy evening favorites inspired by Karnataka home kitchens.", "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80")
        );

        List<Category> existing = categoryRepository.findAll();
        Map<String, Category> existingBySlug = existing.stream().collect(Collectors.toMap(Category::getSlug, c -> c, (left, right) -> left));
        List<Category> toSave = new ArrayList<>();

        for (Category requiredCategory : requiredCategories) {
            Category category = existingBySlug.getOrDefault(requiredCategory.getSlug(), requiredCategory);
            category.setName(requiredCategory.getName());
            category.setSlug(requiredCategory.getSlug());
            category.setDescription(requiredCategory.getDescription());
            category.setImageUrl(requiredCategory.getImageUrl());
            toSave.add(category);
        }

        categoryRepository.saveAll(toSave);
        existing = categoryRepository.findAll();

        return existing.stream().collect(Collectors.toMap(Category::getSlug, c -> c, (left, right) -> left));
    }

    private void ensureItems(ItemRepository itemRepository, Map<String, Category> categories) {
        Map<String, Item> existingBySlug = itemRepository.findAll().stream()
                .collect(Collectors.toMap(Item::getSlug, item -> item, (left, right) -> left));

        existingBySlug.values().forEach(item -> item.setAvailable(false));

        List<Item> seededItems = List.of(
                item("Jolada Rotti", "jolada-rotti", "Freshly patted jowar rotti served with homemade accompaniments and a soft smoky finish.", 149.0, "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80", categories.get("jolada-rotti"), true, 2, 4.9, 412, 22, "Jowar flour,Ghee,Onion kosambari,Homestyle accompaniment", "Best Seller,Homemade Favorite", "Soft, earthy, and handmade for a true home-kitchen feel."),
                item("Stuffed Ennegayi", "stuffed-ennegayi", "Baby brinjals simmered in a rich groundnut and sesame masala just like a home Sunday lunch.", 169.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80", categories.get("ennegayi"), true, 3, 4.8, 286, 24, "Baby brinjal,Groundnut,Sesame,Dry coconut", "House Special,Traditional", "Nutty, silky, and deeply comforting."),
                item("Shenga Chutney", "shenga-chutney", "Roasted groundnut chutney with byadgi chilli, garlic, and a smoky homemade finish.", 79.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=80", categories.get("chutney"), true, 2, 4.9, 158, 14, "Groundnut,Byadgi chilli,Garlic,Curry leaves", "Pantry Hero,Fresh Batch", "A bold chutney that instantly lifts rotis and snacks."),
                item("Girmit", "girmit", "Crisp puffed rice tossed with masala, onion, and coriander for a proper evening tiffin.", 109.0, "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", categories.get("snacks"), true, 2, 4.7, 193, 18, "Puffed rice,Onion,Chilli powder,Coriander", "Evening Snack,Crunchy", "Light, spicy, and ready for chai time."),
                item("Mandakki Oggarane", "mandakki-oggarane", "Tempered puffed rice with peanuts and turmeric for a quick homemade bite.", 99.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80", categories.get("snacks"), true, 2, 4.5, 88, 16, "Puffed rice,Peanuts,Turmeric,Green chilli", "Quick Bite,Budget Pick", "Simple, warm, and quietly addictive."),
                item("Kharada Pundi", "kharada-pundi", "Soft rice bites with a spicy seasoning and coconut touch, served snack-style.", 119.0, "https://images.unsplash.com/photo-1516685018646-549d52b2d9f9?w=1200&q=80", categories.get("snacks"), true, 3, 4.5, 57, 19, "Rice flour,Chilli,Coconut,Mustard", "Spicy,Homestyle", "A soft bite with a bright chilli kick.")
        );

        for (Item seededItem : seededItems) {
            Item item = existingBySlug.getOrDefault(seededItem.getSlug(), seededItem);
            item.setName(seededItem.getName());
            item.setSlug(seededItem.getSlug());
            item.setDescription(seededItem.getDescription());
            item.setPrice(seededItem.getPrice());
            item.setImageUrl(seededItem.getImageUrl());
            item.setCategory(seededItem.getCategory());
            item.setVeg(seededItem.isVeg());
            item.setSpiceLevel(seededItem.getSpiceLevel());
            item.setAvailable(true);
            item.setRating(seededItem.getRating());
            item.setReviewCount(seededItem.getReviewCount());
            item.setDeliveryTimeMinutes(seededItem.getDeliveryTimeMinutes());
            item.setIngredients(seededItem.getIngredients());
            item.setTags(seededItem.getTags());
            item.setHighlight(seededItem.getHighlight());
            item.setAvailable(true);
            existingBySlug.put(item.getSlug(), item);
        }

        itemRepository.saveAll(existingBySlug.values());
    }

    private Category category(String name, String slug, String description, String imageUrl) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        category.setImageUrl(imageUrl);
        return category;
    }

    private Item item(String name, String slug, String description, double price, String imageUrl, Category category, boolean isVeg, int spiceLevel, double rating, int reviewCount, int deliveryTimeMinutes, String ingredients, String tags, String highlight) {
        return Item.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .price(price)
                .imageUrl(imageUrl)
                .category(category)
                .isVeg(isVeg)
                .spiceLevel(spiceLevel)
                .rating(rating)
                .reviewCount(reviewCount)
                .deliveryTimeMinutes(deliveryTimeMinutes)
                .ingredients(ingredients)
                .tags(tags)
                .highlight(highlight)
                .isAvailable(true)
                .build();
    }
}
