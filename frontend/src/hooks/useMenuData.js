import { useEffect, useMemo, useState } from 'react';
import { categoryService, itemService } from '../services/dataService';
import { useToast } from '../context/ToastContext';

const formatDeliveryTime = (minutes) => `${minutes || 25} mins`;

const normalizeItem = (item) => ({
  ...item,
  category: item.categoryName,
  image: item.image,
  rating: item.rating ?? 4.5,
  reviews: item.reviewCount ?? 0,
  type: item.isVeg === false ? 'non-veg' : 'veg',
  deliveryTime: formatDeliveryTime(item.deliveryTimeMinutes),
  ingredients: item.ingredients || [],
  tags: item.tags || [],
  highlight: item.highlight || item.description,
});

const normalizeCategory = (category) => ({
  ...category,
  subtitle: category.description,
  image: category.image,
});

export default function useMenuData() {
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
        const [itemsResponse, categoriesResponse] = await Promise.all([itemService.getAll(), categoryService.getAll()]);
        if (cancelled) return;

        setMenuItems((itemsResponse.data || []).map(normalizeItem));
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
  }, [showToast]);

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
