// src/store/usePrayerStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PrayerStore {
  city: string;
  country: string;
  prayers: { [key: string]: string };
  setLocation: (city: string, country: string) => void;
  setPrayers: (prayers: { [key: string]: string }) => void;
}

export const usePrayerStore = create<PrayerStore>()(
  persist(
    (set) => ({
      city: "",
      country: "",
      prayers: {},
      setLocation: (city, country) => set({ city, country }),
      setPrayers: (prayers) => set({ prayers }),
    }),
    {
      name: "prayer-store", // localStorage key
    }
  )
);
