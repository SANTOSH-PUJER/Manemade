package manemade.backend.config;

import manemade.backend.repository.*;
import manemade.backend.entity.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class DataInitializer {

        private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

        @Bean
        CommandLineRunner initData(
                        CategoryRepository categoryRepository,
                        ItemRepository itemRepository,
                        UserRepository userRepository,
                        AddressRepository addressRepository,
                        ItemAttributesRepository itemAttributesRepository,
                        OrderRepository orderRepository,
                        PaymentRepository paymentRepository,
                        PasswordEncoder passwordEncoder,
                        JdbcTemplate jdbcTemplate) {
                return args -> {

                        // Safety ensuring unique indexes (handled by Jpa ddl-auto=update usually, but
                        // explicit for stability)
                        log.info("Starting safe database initialization...");

                        // Flush constraints physically into the DB Schema
                        try {
                                jdbcTemplate.execute("ALTER TABLE users ADD CONSTRAINT uk_user_email UNIQUE (email)");
                                log.info("Unique email constraint added successfully.");
                        } catch (Exception e) {
                                log.info("Unique email constraint already exists or could not be added.");
                        }
                        try {
                                jdbcTemplate.execute(
                                                "ALTER TABLE users ADD CONSTRAINT uk_user_mobile UNIQUE (mobile_number)");
                                log.info("Unique mobile constraint added successfully.");
                        } catch (Exception e) {
                                log.info("Unique mobile constraint already exists or could not be added.");
                        }

                        // 1. Ensure Admin User exists with correct Role
                        userRepository.findByEmail("manemade.admin@gmail.com")
                                        .or(() -> userRepository.findByMobileNumber("9999999999"))
                                        .orElseGet(() -> {
                                                User user = User.builder()
                                                                .firstName("ManeMade")
                                                                .lastName("Admin")
                                                                .email("manemade.admin@gmail.com")
                                                                .mobileNumber("9999999999")
                                                                .password(passwordEncoder.encode("admin123"))
                                                                .role("ADMIN")
                                                                .build();
                                                return userRepository.save(user);
                                        });

                        // 2. Ensure Default User exists
                        User defaultUser = userRepository.findByEmail("santosh@example.com")
                                        .or(() -> userRepository.findByMobileNumber("9876543210"))
                                        .orElseGet(() -> {
                                                User user = User.builder()
                                                                .firstName("Santosh")
                                                                .lastName("Pujer")
                                                                .email("santosh@example.com")
                                                                .mobileNumber("9876543210")
                                                                .password(passwordEncoder.encode("password123"))
                                                                .role("USER")
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
                                address.setIsDefault(true);
                                addressRepository.save(address);
                        }

                        // 3. Ensure Categories (Final 8) - Idempotent
                        Map<String, Category> categories = ensureCategories(categoryRepository);

                        // 4. Ensure 48 Curated Items and their Attributes - Idempotent
                        List<Item> savedItems = ensureItems(itemRepository, categories);
                        ensureItemAttributes(itemAttributesRepository, savedItems);

                        // 5. Ensure Sample Orders and Payments
                        if (orderRepository.count() == 0) {
                                ensureSampleOrdersAndPayments(orderRepository, paymentRepository,
                                                defaultUser, savedItems,
                                                addressRepository
                                                                .findByUserIdAndIsDeletedFalse(
                                                                                defaultUser.getId())
                                                                .get(0));
                        }
                };
        }

        private Map<String, Category> ensureCategories(CategoryRepository categoryRepository) {
                List<Category> requiredCategories = List.of(
                                category("Rotti & Tiffin", "rotti-tiffin",
                                                "Millet-first flatbreads and regional breakfast staples.",
                                                "/images/Categories/JoLada Rotti.jpg"),
                                category("Dry Snacks", "dry-snacks",
                                                "Crunchy, hand-tossed regional bites for any time of the day.",
                                                "/images/Categories/DrySnacks.avif"),
                                category("Fried Snacks", "fried-snacks",
                                                "Crispy afternoon treats inspired by the spicy street flavors of North Karnataka.",
                                                "/images/Categories/FriedSnacks.jpg"),
                                category("Sweets", "sweets",
                                                "Artisanal desserts crafted with traditional ingredients like pure jaggery and milk solids.",
                                                "/images/Categories/Sweets.jpg"),
                                category("Millet Specials", "millet-specials",
                                                "Low-GI, nutrient-rich creations inspired by ancestral food wisdom.",
                                                "/images/Categories/MilletSpecials.avif"),
                                category("Chutney Powders", "chutney-powders",
                                                "Smoky, hand-ground condiments that bring a regional zing to every meal.",
                                                "/images/Categories/ChutneyPowders.jpg"),
                                category("Combo Packs", "combo-packs",
                                                "Curated selection boxes that let you explore the complete taste of home.",
                                                "/images/Categories/ComboPacks.jpg"),
                                category("Travel Snacks", "travel-snacks",
                                                "Packed for the journey - mess-free, delicious, and deeply nostalgic bites.",
                                                "/images/Categories/TravelSnacks.jpg"));

                for (Category req : requiredCategories) {
                        categoryRepository.findBySlug(req.getSlug()).ifPresentOrElse(
                                        existing -> {
                                                if (!existing.getImageUrl().equals(req.getImageUrl())) {
                                                        existing.setImageUrl(req.getImageUrl());
                                                        categoryRepository.save(existing);
                                                }
                                        },
                                        () -> categoryRepository.save(req));
                }

                return categoryRepository.findAll().stream()
                                .collect(Collectors.toMap(Category::getSlug, c -> c, (left, right) -> left));
        }

        private List<Item> ensureItems(ItemRepository itemRepository, Map<String, Category> categories) {
                List<Item> items = new ArrayList<>();

                // 1. Rotti & Tiffin
                Category rotti = categories.get("rotti-tiffin");
                items.add(item("Jolada Rotti", "jolada-rotti",
                                "Signature hand-pressed jowar flatbread, fire-roasted for an authentic taste.", 15.0,
                                "/images/Rotties/JoladaRotti.jpg", rotti));
                items.add(item("Ragi Rotti", "ragi-rotti",
                                "Wholesome finger millet rotti with onions and chopped green chillies.", 25.0,
                                "/images/Rotties/RaagiRotti.jpg", rotti));
                items.add(item("Sajje Rotti", "sajje-rotti",
                                "High-nutrient pearl millet flatbread, a rustic North Karnataka staple.", 20.0,
                                "/images/Rotties/SajjiRotti.jpg", rotti));
                items.add(item("Akki Rotti", "akki-rotti",
                                "Soft rice flour flatbread with traditional seasonal greens.", 30.0,
                                "/images/Rotties/AkkiRotti.jpg", rotti));
                items.add(
                                item("Masala Rotti", "masala-rotti",
                                                "Spicy flatbread blend of millet flours and house-ground spices.",
                                                35.0,
                                                "/images/Rotties/MasalaRotti.jpg",
                                                rotti));
                items.add(item("Kadak Rotti", "kadak-rotti",
                                "Sun-dried crispy jowar rotti with an exceptionally long shelf life.", 15.0,
                                "/images/Rotties/KadakRotti.jpg", rotti));

                // 2. Dry Snacks
                Category drySnacks = categories.get("dry-snacks");
                items.add(
                                item("Churmuri (Dry)", "dry-churmuri",
                                                "Crispy puffed rice seasoned with peanuts and regional spices.",
                                                45.0,
                                                "/images/DrySnacks/Churumuri.png",
                                                drySnacks));
                items.add(item("Mandakki Masala", "mandakki-masala",
                                "Spicy roasted mandakki that's the perfect teatime companion.", 50.0,
                                "/images/DrySnacks/Mandakki.jpg", drySnacks));
                items.add(item("Roasted Shenga (Groundnuts)", "roasted-shenga",
                                "Crisp, fire-roasted groundnuts with our special house-mix seasoning.", 60.0,
                                "/images/DrySnacks/RoastedShenga.jpg", drySnacks));
                items.add(item("Hurigadale (Roasted Gram)", "hurigadale",
                                "Crunchy roasted gram seasoned with dry chillies and curry leaves.", 40.0,
                                "/images/DrySnacks/Hurigadle.jpg", drySnacks));
                items.add(item("Spiced Avalakki (Poha Mix)", "spiced-avalakki",
                                "Homemade beaten rice mix with dry fruits and spicy tempering.", 75.0,
                                "/images/DrySnacks/SpicedAvalakki.jpg", drySnacks));
                items.add(item("Dry Corn Mixture", "dry-corn-mixture",
                                "Sweet and spicy corn flakes mixture made with organic sunflower oil.", 65.0,
                                "/images/DrySnacks/DryCornMixture.jpg", drySnacks));

                // 3. Fried Snacks
                Category friedSnacks = categories.get("fried-snacks");
                items.add(item("Chakli", "chakli", "Crisp spiral bites made from rice flour and a secret spice blend.",
                                60.0,
                                "/images/FriedSnacks/Chakli.jpg",
                                friedSnacks));
                items.add(item("Kodubale", "kodubale",
                                "Ring-shaped spicy snacks, a signature Hubballi evening favorite.", 70.0,
                                "/images/FriedSnacks/Kodubale.jpg",
                                friedSnacks));
                items.add(item("Nippattu", "nippattu",
                                "Spicy, flat rice crackers loaded with fried groundnuts and sesame.",
                                55.0, "/images/FriedSnacks/Nippattu.jpg",
                                friedSnacks));
                items.add(item("Khara Boondi", "khara-boondi",
                                "Spicy deep-fried gram flour globules, exceptionally light and crisp.", 50.0,
                                "/images/FriedSnacks/KhaarBoondi.jpg",
                                friedSnacks));
                items.add(item("Sev (Omapodi)", "sev", "Fine gram flour strands seasoned with aromatic carom seeds.",
                                45.0,
                                "/images/FriedSnacks/Sev.jpg",
                                friedSnacks));
                items.add(item("Shankar Poli", "shankar-poli",
                                "Sweet and crispy diamond bites made from refined flour and sugar.", 65.0,
                                "/images/FriedSnacks/ShankarPoli.jpg",
                                friedSnacks));

                // 4. Sweets
                Category sweets = categories.get("sweets");
                items.add(item("Dharwad Peda", "dharwad-peda",
                                "The legendary caramelized milk fudge with its signature dark brown hue.", 120.0,
                                "/images/Sweets/Dharwad-Pedha.jpg", sweets));
                items.add(item("Kunda", "belagavi-kunda",
                                "Rich, slow-cooked caramelized milk pudding - a true Belagavi treasure.", 140.0,
                                "/images/Sweets/Kunda.jpg", sweets));
                items.add(item("Ragi Ladoo", "ragi-ladoo",
                                "Nutritious finger millet balls sweetened with organic jaggery and ghee.", 90.0,
                                "/images/Sweets/RagiLadoo.jpeg", sweets));
                items.add(item("Coconut Ladoo", "coconut-ladoo",
                                "Freshly grated coconut bites infused with cardamom and sweetness.", 80.0,
                                "/images/Sweets/CoconutLadoo.jpg", sweets));
                items.add(item("Groundnut Chikki", "groundnut-chikki",
                                "Crunchy jaggery bars loaded with perfectly roasted groundnuts.", 50.0,
                                "/images/Sweets/GroundnutChikki.JPG", sweets));
                items.add(item("Til (Sesame) Ladoo", "til-ladoo",
                                "Hearty sesame and jaggery balls, the quintessential winter treat.", 70.0,
                                "/images/Sweets/Til(sesame)Ladoo.jpg", sweets));

                // 5. Millet Specials
                Category millets = categories.get("millet-specials");
                items.add(item("Ragi Murukku", "ragi-murukku",
                                "High-fiber finger millet murukku with a distinct nutty flavor.",
                                70.0, "/images/MilletSpecails/Ragi_Murukku.jpg",
                                millets));
                items.add(item("Jowar Murukku", "jowar-murukku",
                                "Light and airy jowar crackers, a heart-healthy snack choice.",
                                75.0, "/images/MilletSpecails/JowarMurakku.jpg",
                                millets));
                items.add(
                                item("Bajra Khakhra", "bajra-khakhra",
                                                "Hand-roasted pearl millet khakhra, incredibly crisp and thin.",
                                                80.0,
                                                "/images/MilletSpecails/BajraKhakhra.png",
                                                millets));
                items.add(item("Ragi Chips", "ragi-chips", "Spicy millet-based chips for the modern snack lover.", 55.0,
                                "/images/MilletSpecails/RagiChips.jpg", millets));
                items.add(item("Multigrain Khakhra", "multigrain-khakhra",
                                "A powerhouse of five ancestral grains roasted to perfection.", 90.0,
                                "/images/MilletSpecails/MultigrainKhakhra.jpg", millets));
                items.add(item("Ragi Dry Snack Mix", "ragi-dry-mix",
                                "A healthy mix of baked ragi bites, seeds, and roasted nuts.", 110.0,
                                "/images/MilletSpecails/RagiDrySnackMix.jpg", millets));

                // 6. Chutney Powders
                Category chutney = categories.get("chutney-powders");
                items.add(item("Shenga Chutney Pudi", "shenga-chutney",
                                "The famous roasted groundnut chutney powder that lifts every rotti.", 45.0,
                                "/images/ChutnuyPowders/ShengaChutnuy.jpg", chutney));
                items.add(item("Karibevu Chutney Pudi", "karibevu-chutney",
                                "Aromatic curry leaf powder, rich in iron and packed with flavor.", 55.0,
                                "/images/ChutnuyPowders/KaribevuChutnuy.jpg", chutney));
                items.add(item("Dry Garlic Chutney Powder", "garlic-chutney",
                                "A spicy, smoky garlic powder that's the soul of Hubballi street bites.", 50.0,
                                "/images/ChutnuyPowders/DryGarlicChutnuy.jpg", chutney));
                items.add(
                                item("Flaxseed Powder", "flaxseed-powder",
                                                "Omega-3 rich flaxseed powder blended with regional spices.",
                                                65.0,
                                                "/images/ChutnuyPowders/FlaxSeedPowder.jpg",
                                                chutney));
                items.add(
                                item("Ellu (Sesame) Chutney Powder", "sesame-chutney",
                                                "Rich sesame powder with a deep, earthy finish.",
                                                60.0,
                                                "/images/ChutnuyPowders/ElluSesamePowder.jpg",
                                                chutney));
                items.add(item("Rasam Powder", "rasam-powder",
                                "Artisanal rasam mix that recreates the soul of Mysore's kitchens.", 70.0,
                                "/images/ChutnuyPowders/RasamPowder.jpg", chutney));

                // 7. Combo Packs
                Category combo = categories.get("combo-packs");
                items.add(item("North Karnataka Snack Combo", "nk-combo",
                                "A grand assortment of chakli, kodubale, nippattu, and sweets.", 299.0,
                                "/images/Categories/ComboPacks.jpg", combo));
                items.add(item("Millet Combo Pack", "millet-combo",
                                "A selection of all our millet murukkus, chips, and khakhras.", 349.0,
                                "/images/Categories/ComboPacks.jpg", combo));
                items.add(item("Family Snack Pack", "family-pack",
                                "The ultimate weekly assortment for every generation in the family.", 499.0,
                                "/images/Categories/ComboPacks.jpg", combo));
                items.add(
                                item("Kids Snack Box", "kids-box",
                                                "Less spicy, highly nutritious, and fun shapes for the little ones.",
                                                249.0,
                                                "/images/Categories/ComboPacks.jpg",
                                                combo));
                items.add(item("Sweet Combo Pack", "sweet-combo",
                                "A variety box of Peda, Kunda, and Ladoos for celebrations.",
                                399.0, "/images/Categories/ComboPacks.jpg",
                                combo));
                items.add(item("Festival Special Pack", "festival-pack",
                                "Limited edition box featuring our most festive seasonal delights.", 599.0,
                                "/images/Categories/ComboPacks.jpg", combo));

                // 8. Travel Snacks
                Category travel = categories.get("travel-snacks");
                items.add(
                                item("Dry Churmuri Pack", "travel-churmuri",
                                                "Mess-free individual packs for journeys of any distance.",
                                                99.0,
                                                "/images/TravelSnacks/DryCurumuriPack.jpg",
                                                travel));
                items.add(item("Groundnut Chikki Pack", "travel-chikki",
                                "High-energy trail bars that travel perfectly in any weather.", 149.0,
                                "/images/TravelSnacks/GroundnutChikkipack.jpg", travel));
                items.add(item("Kodubale Pack", "travel-kodubale",
                                "Durable spice rings that retain their crunch throughout the trip.", 129.0,
                                "/images/TravelSnacks/KodubalePack.jpg", travel));
                items.add(
                                item("Nippattu Pack", "travel-nippattu",
                                                "Stackable crackers, the perfect mess-free road trip partner.",
                                                139.0,
                                                "/images/TravelSnacks/NippattuPack.jpg",
                                                travel));
                items.add(item("Ragi Murukku Pack", "travel-murukku",
                                "Nutrient-dense millet sticks packaged for ultimate convenience.", 159.0,
                                "/images/TravelSnacks/RagiMurukkuPack.jpg", travel));
                items.add(
                                item("Mixed Dry Snacks Pack", "travel-mixed",
                                                "The best of everything, packed for sharing on the move.",
                                                259.0,
                                                "/images/TravelSnacks/MixedDrySnacksPack.jpg",
                                                travel));

                List<Item> savedItems = new ArrayList<>();
                for (Item req : items) {
                        itemRepository.findByItemSlug(req.getItemSlug()).ifPresentOrElse(
                                        existing -> {
                                                if (!existing.getItemImage().equals(req.getItemImage())) {
                                                        existing.setItemImage(req.getItemImage());
                                                }
                                                // Also update description and price if they changed significantly
                                                existing.setShortDescription(req.getShortDescription());
                                                existing.setPrice(req.getPrice());
                                                savedItems.add(itemRepository.save(existing));
                                        },
                                        () -> savedItems.add(itemRepository.save(req)));
                }

                return savedItems;
        }

        private void ensureItemAttributes(ItemAttributesRepository repository, List<Item> items) {
                if (repository.count() > 0)
                        return;
                List<ItemAttributes> attributes = items.stream().map(item -> {
                        ItemAttributes attr = new ItemAttributes();
                        attr.setItem(item);
                        attr.setQuantity("500g");
                        attr.setPrice(item.getPrice());
                        return attr;
                }).collect(Collectors.toList());
                repository.saveAll(attributes);
        }

        private void ensureSampleOrdersAndPayments(OrderRepository orderRepo, PaymentRepository paymentRepo, User user,
                        List<Item> items, Address address) {
                if (orderRepo.count() > 0)
                        return;

                Order order = new Order();
                order.setUser(user);
                order.setAddress(address);
                order.setStatus("DELIVERED");
                order.setTotalAmount(500.0);
                order.setPaymentMode("upi");
                order.setTransactionId("PAY-SAMPLE-001");

                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setItem(items.get(0));
                orderItem.setQuantity(2);
                orderItem.setPrice(items.get(0).getPrice());
                order.addOrderItem(orderItem);

                Order savedOrder = orderRepo.save(order);

                Payment payment = new Payment();
                payment.setUser(user);
                payment.setOrder(savedOrder);
                payment.setAmount(500.0);
                payment.setMethod("upi");
                payment.setStatus("SUCCESS");
                payment.setTransactionId("PAY-SAMPLE-001");
                paymentRepo.save(payment);
        }

        private Category category(String name, String slug, String description, String imageUrl) {
                Category category = new Category();
                category.setName(name);
                category.setSlug(slug);
                category.setDescription(description);
                category.setImageUrl(imageUrl);
                return category;
        }

        private Item item(String name, String slug, String description, double price, String imageUrl,
                        Category category) {
                return Item.builder()
                                .itemName(name)
                                .itemSlug(slug)
                                .shortDescription(description)
                                .price(price)
                                .itemImage(imageUrl)
                                .category(category)
                                .isAvailable(true)
                                .isDeleted(false)
                                .build();
        }
}
