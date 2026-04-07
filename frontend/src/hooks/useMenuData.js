import { useEffect, useMemo, useState } from 'react';
import { categoryService, itemService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

const formatDeliveryTime = (minutes) => `${minutes || 25} mins`;

const normalizeItem = (item) => ({
  ...item,
  name: item.itemName,
  slug: item.itemSlug,
  description: item.shortDescription,
  image: item.itemImage,
  category: item.categoryName,
  rating: 4.5, // Default UI fallback
  reviews: 42,
  type: 'veg',
  deliveryTime: formatDeliveryTime(25),
  ingredients: [],
  tags: [],
  highlight: item.shortDescription,
});

const normalizeCategory = (category) => ({
  ...category,
  subtitle: category.description,
  image: category.image,
});

export default function useMenuData(categorySlug, searchQuery = '') {
  const { showToast } = useToast();
  const [menuItems, setMenuItems] = useState([]);
  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchItems = searchQuery.trim() 
            ? itemService.search(searchQuery)
            : itemService.getAll(categorySlug);

        const [itemsResponse, categoriesResponse] = await Promise.all([
            fetchItems, 
            categoryService.getAll()
        ]);
        if (cancelled) return;

        let items = (itemsResponse.data || []).map(normalizeItem);
        // If we have a category slug AND a search query, filter the search results locally by category
        if (searchQuery && categorySlug && categorySlug !== 'All') {
            items = items.filter(it => it.categorySlug === categorySlug);
        }

        setMenuItems(items);
        setMenuCategories((categoriesResponse.data || []).map(normalizeCategory));
      } catch (requestError) {
        if (!cancelled) {
          const message = requestError.response?.data?.message || 'The menu could not be loaded from the backend.';
          setError(message);
          setMenuItems([]);
          setMenuCategories([]);
          showToast({ title: 'Menu unavailable', description: message });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMenu();
    return () => {
      cancelled = true;
    };
  }, [showToast, categorySlug, searchQuery]);

  const categoryNames = useMemo(
    () => [...new Set(menuItems.map((dish) => dish.category).filter(Boolean))],
    [menuItems],
  );

  return {
    menuItems,
    menuCategories,
    categoryNames,
    loading,
    error,
  };
}
