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
    const fetchLocationAndTimings = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const getCurrentDate = () => {
              const today = new Date();
              const day = String(today.getDate()).padStart(2, '0');
              const month = String(today.getMonth() + 1).padStart(2, '0');
              const year = today.getFullYear();
              return `${day}-${month}-${year}`;
            }; 
            const { city, country } = await reverseGeocode(latitude, longitude);
            const address = `${city}, ${country}`;
            setLocation(address);
            

            const currentDate = getCurrentDate();
            const encodedAddress = encodeURIComponent(address);
            
            const res = await fetch(
              `https://api.aladhan.com/v1/timingsByAddress/${currentDate}?address=${encodedAddress}&method=8&tune=2,3,4,5,2,3,4,5,-3`
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

            const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
            setDay(weekday);
          } catch {
            setLocation("Location unavailable");
          }
        },
        () => {
          setLocation("Permission denied");
        }
      );
    };

    fetchLocationAndTimings();
  }, []);

  if (!timings || !day) return <div className="text-center mt-10">Loading...</div>;

  const {
    nextPrayer,
    nextIn,
    passedPrayersCount,
    segmentProgress,
  } = getNextPrayer(timings);

  return (
    <div className="relative min-h-screen bg-gray-100 pb-20">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-10 bg-white shadow-md py-3 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-purple-700">
          <img src="/logo.jpg" alt="Logo" className="h-6" />
          <span className="text-lg">madrasa</span>
        </div>
        <div className="text-xs text-gray-600 truncate max-w-[60%]">📍 {location}</div>
      </div>

      {/* Prayer Card Centered */}
      <div className="flex items-center justify-center p-4">
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

      {/* Mobile Footer */}
      <BottomNav />
    </div>
  );
}

export default App;
