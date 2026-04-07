package manemade.backend.service;

import manemade.backend.dto.ItemResponse;
import manemade.backend.entity.Item;
import manemade.backend.repository.ItemRepository;
import manemade.backend.repository.CategoryRepository;
import manemade.backend.repository.ItemAttributesRepository;
import manemade.backend.entity.ItemAttributes;
import manemade.backend.entity.Category;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final ItemAttributesRepository itemAttributesRepository;

    public ItemService(ItemRepository itemRepository, CategoryRepository categoryRepository, ItemAttributesRepository itemAttributesRepository) {
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.itemAttributesRepository = itemAttributesRepository;
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByCategory(String categorySlug) {
        return itemRepository.findByCategory_SlugAndIsAvailableTrueAndIsDeletedFalse(categorySlug).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getItemsByCategoryId(Long categoryId) {
        return itemRepository.findByCategory_IdAndIsAvailableTrueAndIsDeletedFalse(categoryId).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> searchItems(String query) {
        return itemRepository.searchItems(query).stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ItemResponse> getAllItems() {
        return itemRepository.findByIsAvailableTrueAndIsDeletedFalse().stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ItemResponse getItemBySlug(String slug) {
        Item item = itemRepository.findByItemSlugAndIsAvailableTrue(slug)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        return mapToResponse(item);
    }

    @Transactional
    public ItemResponse createItem(Item item) {
        if (item.getCategory() != null && item.getCategory().getName() != null) {
            String catName = item.getCategory().getName();
            Category category = categoryRepository.findByName(catName)
                .orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(catName);
                    newCat.setSlug(catName.toLowerCase().replace(" ", "-"));
                    return categoryRepository.save(newCat);
                });
            item.setCategory(category);
        }
        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    @Transactional
    public ItemResponse updateItem(Long id, Item itemDetails) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        item.setItemName(itemDetails.getItemName());
        item.setItemSlug(itemDetails.getItemSlug());
        item.setShortDescription(itemDetails.getShortDescription());
        item.setLongDescription(itemDetails.getLongDescription());
        item.setItemImage(itemDetails.getItemImage());
        item.setPrice(itemDetails.getPrice());
        item.setIsAvailable(itemDetails.getIsAvailable());

        if (itemDetails.getCategory() != null && itemDetails.getCategory().getName() != null) {
            String catName = itemDetails.getCategory().getName();
            Category category = categoryRepository.findByName(catName)
                .orElseGet(() -> {
                    Category newCat = new Category();
                    newCat.setName(catName);
                    newCat.setSlug(catName.toLowerCase().replace(" ", "-"));
                    return categoryRepository.save(newCat);
                });
            item.setCategory(category);
        }

        Item saved = itemRepository.save(item);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteItem(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        item.setIsDeleted(true); // Soft delete
        itemRepository.save(item);
    }

    private ItemResponse mapToResponse(Item item) {
        ItemAttributes attr = itemAttributesRepository.findByItemId(item.getId()).orElse(null);
        
        return ItemResponse.builder()
                .id(item.getId())
                .itemSlug(item.getItemSlug())
                .itemName(item.getItemName())
                .shortDescription(item.getShortDescription())
                .longDescription(item.getLongDescription())
                .price(item.getPrice())
                .itemImage(item.getItemImage())
                .categoryId(item.getCategory() != null ? item.getCategory().getId() : null)
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .categorySlug(item.getCategory() != null ? item.getCategory().getSlug() : null)
                .isAvailable(item.getIsAvailable())
                .quantity(attr != null ? attr.getQuantity() : null)
                .attributePrice(attr != null ? attr.getPrice() : null)
                .build();
    }
}
