import { useState, useEffect } from "react";
import PrayerCard from "./components/PrayerCard";
import "./index.css";
import { getNextPrayer } from "./utils/getNextPrayer";

function App() {
  const [timings, setTimings] = useState<{
    [key: string]: string;
  } | null>(null);

  const [day, setDay] = useState<string>("");

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

  if (!timings || !day) return <div>Loading...</div>;

  const {
    nextPrayer,
    nextIn,
    passedPrayersCount,
    segmentProgress,
  } = getNextPrayer(timings);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
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
  );
}

export default App;
