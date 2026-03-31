package manemade.backend.service;

import manemade.backend.dto.ItemResponse;
import manemade.backend.repository.ItemRepository;
import manemade.backend.entity.Item;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    public List<ItemResponse> getItemsByCategory(String categorySlug) {
        return itemRepository.findByCategory_Slug(categorySlug).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ItemResponse> getItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategory_Id(categoryId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ItemResponse> searchItems(String query) {
        return itemRepository.searchItems(query).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ItemResponse> getAllItems() {
        return itemRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ItemResponse createItem(Item item) {
        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .image(item.getImageUrl())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .isVeg(item.isVeg())
                .spiceLevel(item.getSpiceLevel())
                .isAvailable(item.isAvailable())
                .build();
    }
}
