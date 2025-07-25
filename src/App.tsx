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

  useEffect(() => {
    const fetchTimings = async () => {
      const res = await fetch(
        "https://api.aladhan.com/v1/timingsByCity?city=Lahore&country=Pakistan"
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
    };

    fetchTimings();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const { city, country } = await reverseGeocode(latitude, longitude);
          setLocation(`${city}, ${country}`);
        } catch {
          setLocation("Location unavailable");
        }
      },
      () => {
        setLocation("Permission denied");
      }
    );
  }, []);

  if (!timings || !day) return <div>Loading...</div>;

  const {
    nextPrayer,
    nextIn,
    passedPrayersCount,
    segmentProgress,
  } = getNextPrayer(timings);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4 pb-20">
      {/* 🌐 Navbar */}
      <div className="w-full max-w-md bg-white rounded-xl shadow flex justify-between items-center px-4 py-3 mb-4">
        <div className="flex items-center gap-2 font-bold text-purple-700">
          <img src="/logo.jpg" alt="Logo" className="h-6" />
          <span className="text-lg">madrasa</span>
        </div>
        <div className="text-xs text-gray-600">📍 {location}</div>
      </div>

      {/* 📿 PrayerCard Wrapper */}
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

      {/* 📱 Bottom Nav (mobile only) */}
      <BottomNav />
    </div>
  );
}

export default App;
