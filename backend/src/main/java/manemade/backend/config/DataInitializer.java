package manemade.backend.config;

import manemade.backend.entity.*;
import manemade.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CategoryRepository categoryRepository, 
                               ItemRepository itemRepository,
                               UserRepository userRepository,
                               AddressRepository addressRepository) {
        return args -> {
            // Initialize Default User
            User defaultUser;
            if (userRepository.count() == 0) {
                defaultUser = User.builder()
                        .firstName("Santosh")
                        .lastName("Pujer")
                        .email("santosh@example.com")
                        .mobileNumber("9876543210")
                        .password("password123") // Should be encoded in a real app
                        .build();
                defaultUser = userRepository.save(defaultUser);
                
                Address address = new Address();
                address.setUser(defaultUser);
                address.setLine1("1st Block, Rajajinagar");
                address.setCity("Bangalore");
                address.setState("Karnataka");
                address.setPincode("560010");
                address.setDefault(true);
                addressRepository.save(address);
            }

            if (categoryRepository.count() == 0) {
                Category rotti = new Category();
                rotti.setName("Rotti");
                rotti.setSlug("rotti");

                Category chutney = new Category();
                chutney.setName("Chutney");
                chutney.setSlug("chutney");

                Category meals = new Category();
                meals.setName("Meals");
                meals.setSlug("meals");

                Category streetFood = new Category();
                streetFood.setName("Street Food");
                streetFood.setSlug("street-food");

                Category sweets = new Category();
                sweets.setName("Sweets");
                sweets.setSlug("sweets");

                categoryRepository.saveAll(List.of(rotti, chutney, meals, streetFood, sweets));

                if (itemRepository.count() == 0) {
                    itemRepository.saveAll(List.of(
                        Item.builder().name("Jolada Rotti Meal").slug("jolada-rotti").description("Authentic Jowar Roti Meal").price(150.0).imageUrl("https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80").category(meals).build(),
                        Item.builder().name("Ennegayi").slug("ennegayi").description("Stuffed Brinjal Curry").price(120.0).imageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80").category(meals).build(),
                        Item.builder().name("Shenga Chutney").slug("shenga-chutney").description("Peanut Chutney Powder").price(40.0).imageUrl("https://images.unsplash.com/photo-1589119908672-4e941973f5d5?w=500&q=80").category(chutney).build(),
                        Item.builder().name("Dharwad Peda").slug("dharwad-peda").description("Famous Milk Sweet").price(200.0).imageUrl("https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80").category(sweets).build()
                    ));
                }
            }
        };
    }
}
