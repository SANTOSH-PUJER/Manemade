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
                category("Jolada Rotti", "jolada-rotti"),
                category("Chutney", "chutney"),
                category("North Karnataka Meals", "north-karnataka-meals"),
                category("Street Food", "street-food"),
                category("Sweets", "sweets"),
                category("Holige", "holige")
        );

        List<Category> existing = categoryRepository.findAll();
        Map<String, Category> existingBySlug = existing.stream().collect(Collectors.toMap(Category::getSlug, c -> c, (left, right) -> left));
        List<Category> toSave = new ArrayList<>();

        for (Category requiredCategory : requiredCategories) {
            if (!existingBySlug.containsKey(requiredCategory.getSlug())) {
                toSave.add(requiredCategory);
            }
        }

        if (!toSave.isEmpty()) {
            categoryRepository.saveAll(toSave);
            existing = categoryRepository.findAll();
        }

        return existing.stream().collect(Collectors.toMap(Category::getSlug, c -> c, (left, right) -> left));
    }

    private void ensureItems(ItemRepository itemRepository, Map<String, Category> categories) {
        if (itemRepository.count() > 0) {
            return;
        }

        itemRepository.saveAll(List.of(
                item("Jolada Rotti Signature Meal", "jolada-rotti-signature-meal", "Hand-pressed millet rotis paired with ennegayi and shenga chutney.", 189.0, "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80", categories.get("jolada-rotti"), true, 2),
                item("Ennegayi Curry Bowl", "ennegayi-curry-bowl", "Baby brinjals simmered in a roasted peanut and sesame masala.", 169.0, "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80", categories.get("north-karnataka-meals"), true, 3),
                item("Girmit Street Mix", "girmit-street-mix", "Hubballi-style puffed rice snack with crunch and spice.", 119.0, "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", categories.get("street-food"), true, 2),
                item("Shenga Chutney Podi", "shenga-chutney-podi", "Roasted groundnut chutney powder with a smoky finish.", 79.0, "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&q=80", categories.get("chutney"), true, 2),
                item("Dharwad Peda Premium Box", "dharwad-peda-premium-box", "Classic Dharwad peda packed for gifting.", 249.0, "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&q=80", categories.get("sweets"), true, 1),
                item("Kayi Holige Dessert Fold", "kayi-holige-dessert-fold", "Festive holige with coconut and jaggery filling.", 139.0, "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?w=1200&q=80", categories.get("holige"), true, 1),
                item("Ragi Mudde Saaru Combo", "ragi-mudde-saaru-combo", "Wholesome millet dumplings paired with rustic saaru.", 179.0, "https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=80", categories.get("north-karnataka-meals"), true, 2),
                item("Mandakki Oggarane Quick Bowl", "mandakki-oggarane-quick-bowl", "Tempered puffed rice bowl for a quick regional bite.", 109.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80", categories.get("street-food"), true, 2),
                item("Hurali Saaru Soul Bowl", "hurali-saaru-soul-bowl", "Peppery horse gram broth for light dinners.", 149.0, "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80", categories.get("north-karnataka-meals"), true, 3),
                item("Badnekayi Palya Home Thali", "badnekayi-palya-home-thali", "Home-style brinjal stir-fry with comforting sides.", 159.0, "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=1200&q=80", categories.get("north-karnataka-meals"), true, 2),
                item("Kharada Pundi Spice Bites", "kharada-pundi-spice-bites", "Steamed rice bites with a bold spice finish.", 129.0, "https://images.unsplash.com/photo-1516685018646-549d52b2d9f9?w=1200&q=80", categories.get("street-food"), true, 3)
        ));
    }

    private Category category(String name, String slug) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        return category;
    }

    private Item item(String name, String slug, String description, double price, String imageUrl, Category category, boolean isVeg, int spiceLevel) {
        return Item.builder()
                .name(name)
                .slug(slug)
                .description(description)
                .price(price)
                .imageUrl(imageUrl)
                .category(category)
                .isVeg(isVeg)
                .spiceLevel(spiceLevel)
                .isAvailable(true)
                .build();
    }
}
