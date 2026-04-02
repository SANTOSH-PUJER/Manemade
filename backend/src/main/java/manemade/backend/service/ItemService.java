package manemade.backend.service;

import manemade.backend.dto.ItemResponse;
import manemade.backend.entity.Item;
import manemade.backend.repository.ItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    private final ItemRepository itemRepository;

    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByCategory(String categorySlug) {
        return itemRepository.findByCategory_SlugAndIsAvailableTrue(categorySlug).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategory_IdAndIsAvailableTrue(categoryId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> searchItems(String query) {
        return itemRepository.searchItems(query).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getAllItems() {
        return itemRepository.findByIsAvailableTrue().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemBySlug(String slug) {
        Item item = itemRepository.findBySlugAndIsAvailableTrue(slug)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return mapToResponse(item);
    }

    public ItemResponse createItem(Item item) {
        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    private ItemResponse mapToResponse(Item item) {
        return ItemResponse.builder()
                .id(item.getId())
                .slug(item.getSlug())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .image(item.getImageUrl())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .categorySlug(item.getCategory() != null ? item.getCategory().getSlug() : null)
                .rating(item.getRating())
                .reviewCount(item.getReviewCount())
                .isVeg(item.isVeg())
                .spiceLevel(item.getSpiceLevel())
                .isAvailable(item.isAvailable())
                .deliveryTimeMinutes(item.getDeliveryTimeMinutes())
                .ingredients(splitCsv(item.getIngredients()))
                .tags(splitCsv(item.getTags()))
                .highlight(item.getHighlight())
                .build();
    }

    private List<String> splitCsv(String value) {
        if (value == null || value.isBlank()) {
            return Collections.emptyList();
        }
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(part -> !part.isBlank())
                .collect(Collectors.toList());
    }
}
