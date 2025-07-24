// src/utils/reverseGeocode.ts
import axios from "axios";

export const reverseGeocode = async (lat: number, lon: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  const response = await axios.get(url, {
    headers: {
      "User-Agent": "namaz-card",
    },
  });

  const { address } = response.data;

  const city =
    address.city ||
    address.town ||
    address.village ||
    address.hamlet ||
    address.suburb ||
    "Unknown";

  const country = address.country || "Unknown";

  return { city, country };
};
