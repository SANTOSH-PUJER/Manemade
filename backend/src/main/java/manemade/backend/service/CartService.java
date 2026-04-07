package manemade.backend.service;

import manemade.backend.dto.CartItemRequest;
import manemade.backend.dto.CartResponse;
import manemade.backend.entity.Cart;
import manemade.backend.entity.CartItem;
import manemade.backend.entity.Item;
import manemade.backend.entity.User;
import manemade.backend.repository.CartItemRepository;
import manemade.backend.repository.CartRepository;
import manemade.backend.repository.ItemRepository;
import manemade.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {
    private static final String ACTIVE = "ACTIVE";

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public CartService(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            UserRepository userRepository,
            ItemRepository itemRepository
    ) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public CartResponse getActiveCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, CartItemRequest request) {
        Cart cart = getOrCreateActiveCart(userId);
        Item item = getAvailableItem(request.getItemId());

        CartItem cartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), item.getId())
                .orElseGet(() -> {
                    CartItem freshItem = new CartItem();
                    freshItem.setCart(cart);
                    freshItem.setItem(item);
                    freshItem.setQuantity(0);
                    freshItem.setUnitPrice(item.getPrice());
                    cart.addItem(freshItem);
                    return freshItem;
                });

        cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
        cartItem.setUnitPrice(item.getPrice());
        recalculateTotals(cart);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse updateItem(Long userId, Long itemId, CartItemRequest request) {
        Cart cart = getOrCreateActiveCart(userId);
        CartItem cartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        getAvailableItem(itemId);
        cartItem.setQuantity(request.getQuantity());
        recalculateTotals(cart);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateActiveCart(userId);
        CartItem cartItem = cartItemRepository.findByCartIdAndItemId(cart.getId(), itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        cart.removeItem(cartItem);
        recalculateTotals(cart);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public CartResponse clearCart(Long userId) {
        Cart cart = getOrCreateActiveCart(userId);
        cart.getItems().clear();
        cart.setTotalAmount(0.0);
        return mapToResponse(cartRepository.save(cart));
    }

    @Transactional
    public void markCheckedOutIfMatches(Long userId, List<CartItemRequest> requestedItems) {
        cartRepository.findByUserIdAndStatus(userId, ACTIVE).ifPresent(cart -> {
            boolean sameItems = cart.getItems().size() == requestedItems.size()
                    && cart.getItems().stream().allMatch(cartItem ->
                    requestedItems.stream().anyMatch(requestItem ->
                            requestItem.getItemId().equals(cartItem.getItem().getId())
                                    && requestItem.getQuantity() == cartItem.getQuantity()));

            if (sameItems) {
                cart.setStatus("CHECKED_OUT");
                cartRepository.save(cart);
            }
        });
    }

    private Cart getOrCreateActiveCart(Long userId) {
        return cartRepository.findByUserIdAndStatus(userId, ACTIVE)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setStatus(ACTIVE);
                    cart.setTotalAmount(0.0);
                    return cartRepository.save(cart);
                });
    }

    private Item getAvailableItem(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found: " + itemId));
        if (!item.getIsAvailable()) {
            throw new RuntimeException(item.getItemName() + " is currently unavailable");
        }
        return item;
    }

    private void recalculateTotals(Cart cart) {
        double totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
        cart.setTotalAmount(totalAmount);
    }

    private CartResponse mapToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser().getId());
        response.setStatus(cart.getStatus());
        response.setTotalAmount(cart.getTotalAmount());
        response.setTotalItems(cart.getItems().stream().mapToInt(CartItem::getQuantity).sum());
        response.setUpdatedTs(cart.getUpdatedTs());

        List<CartResponse.CartLineItem> items = new ArrayList<>();
        for (CartItem item : cart.getItems()) {
            CartResponse.CartLineItem lineItem = new CartResponse.CartLineItem();
            lineItem.setItemId(item.getItem().getId());
            lineItem.setItemName(item.getItem().getItemName());
            lineItem.setItemSlug(item.getItem().getItemSlug());
            lineItem.setImage(item.getItem().getItemImage());
            lineItem.setCategoryName(item.getItem().getCategory() != null ? item.getItem().getCategory().getName() : null);
            lineItem.setUnitPrice(item.getUnitPrice());
            lineItem.setQuantity(item.getQuantity());
            lineItem.setLineTotal(item.getUnitPrice() * item.getQuantity());
            items.add(lineItem);
        }
        response.setItems(items);

        return response;
    }
}
