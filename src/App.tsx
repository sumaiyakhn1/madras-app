import { useState, useEffect } from "react";
import PrayerCard from "./components/PrayerCard";
import "./index.css";
import { getNextPrayer } from "./utils/getNextPrayer";
import { reverseGeocode } from "./utils/reverseGeocode";
import BottomNav from "./components/BottomNav";

function App() {
  const [timings, setTimings] = useState<{ [key: string]: string } | null>(null);
  const [day, setDay] = useState<string>("");
  const [location, setLocation] = useState<string>("Detecting location...");

  // 📍 Get location + fetch timings
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          setLocation(`${city}, ${country}`);

          // Fetch timings using real city and country
          const res = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`
          );
          const data = await res.json();
          const times = data.data.timings;

          setTimings({
            Fajr: times.Fajr,
            Dhuhr: times.Dhuhr,
            Asr: times.Asr,
            Maghrib: times.Maghrib,
            Isha: times.Isha,
          });

          const today = new Date();
          const weekday = today.toLocaleDateString("en-US", { weekday: "long" });
          setDay(weekday);
        } catch {
          setLocation("Location unavailable");
        }
      },
      () => {
        setLocation("Permission denied");
      }
    );
  }, []);

  if (!timings || !day) return <div className="text-center mt-10">Loading...</div>;

  const {
    nextPrayer,
    nextIn,
    passedPrayersCount,
    segmentProgress,
  } = getNextPrayer(timings);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 bg-white shadow-md px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 font-bold text-purple-700">
          <img src="/logo.jpg" alt="Logo" className="h-6 w-auto" />
          <span className="text-lg">madrasa</span>
        </div>
        <div className="text-xs text-gray-600 truncate max-w-[150px] text-right">
          📍 {location}
        </div>
      </div>

      {/* Main Prayer Card */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-4">
          <PrayerCard
            prayerName={nextPrayer}
            nextIn={nextIn}
            timings={timings}
            active={nextPrayer}
            day={day}
            passedPrayersCount={passedPrayersCount}
            segmentProgress={segmentProgress}
          />
        </div>
      </div>

      {/* Mobile-Only Bottom Nav */}
      <div className="block md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}

export default App;
