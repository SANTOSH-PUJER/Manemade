/**
 * Geolocation utilities for getting user coordinates and reverse geocoding.
 */

export const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

/**
 * Reverse geocoding using Nominatim (OpenStreetMap)
 * A free usage tier is available, but for production, a dedicated service is recommended.
 */
export const reverseGeocodeBatch = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Manemade-App',
        },
      }
    );
    const data = await response.json();
    if (data.address) {
      const { 
        house_number, road, suburb, city, town, village, 
        state, postcode, country 
      } = data.address;

      return {
        line1: [house_number, road, suburb].filter(Boolean).join(', ') || '',
        city: city || town || village || '',
        state: state || '',
        pincode: postcode || '',
        display_name: data.display_name,
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return null;
  }
};
