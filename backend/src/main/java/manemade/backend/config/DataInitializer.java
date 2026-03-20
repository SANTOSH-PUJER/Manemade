package manemade.backend.config;

import manemade.backend.entity.Category;
import manemade.backend.entity.Item;
import manemade.backend.repository.CategoryRepository;
import manemade.backend.repository.ItemRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(CategoryRepository categoryRepository, ItemRepository itemRepository) {
        return args -> {
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

                categoryRepository.saveAll(List.of(rotti, chutney, meals));

                if (itemRepository.count() == 0) {
                    Item joladaRotti = Item.builder()
                            .name("Jolada Rotti")
                            .slug("jolada-rotti")
                            .description("Authentic North Karnataka Jowar Roti")
                            .price(120.0)
                            .imageUrl("https://images.unsplash.com/photo-1626776876729-bab4369a5a5a?w=500&q=80")
                            .category(rotti)
                            .build();

                    Item shengaChutney = Item.builder()
                            .name("Shenga Chutney")
                            .slug("shenga-chutney")
                            .description("Spicy Peanut Chutney Powder")
                            .price(45.0)
                            .imageUrl("https://images.unsplash.com/photo-1589119908672-4e941973f5d5?w=500&q=80")
                            .category(chutney)
                            .build();

                    itemRepository.saveAll(List.of(joladaRotti, shengaChutney));
                }
            }
        };
    }
}
