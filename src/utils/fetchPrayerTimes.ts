// src/utils/fetchPrayerTimes.ts
import axios from "axios";

export const fetchPrayerTimes = async (lat: number, lon: number) => {
  const url = `https://api.aladhan.com/v1/timings`;

  const response = await axios.get(url, {
    params: {
      latitude: lat,
      longitude: lon,
    },
  });

  return response.data.data.timings;
};
