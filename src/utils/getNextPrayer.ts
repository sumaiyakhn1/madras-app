export const getNextPrayer = (timings: { [key: string]: string }) => {
  const now = new Date();
  const ordered = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const prayerTimes = ordered.map((name) => {
    const [hour, minute] = timings[name].split(":").map(Number);
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    return { name, time: date };
  });

  let currentPrayer = "Isha";
  let nextPrayer = "Fajr";

  for (let i = 0; i < prayerTimes.length; i++) {
    const start = prayerTimes[i].time;
    const end = i < prayerTimes.length - 1 ? prayerTimes[i + 1].time : new Date(start.getTime() + 3 * 60 * 60 * 1000); // Isha ends in ~3 hours
    if (now >= start && now < end) {
      currentPrayer = prayerTimes[i].name;
      nextPrayer = prayerTimes[i + 1]?.name || "Fajr";
      break;
    }
  }

  const current = prayerTimes.find(p => p.name === currentPrayer)!;
  const next = prayerTimes.find(p => p.name === nextPrayer);

  const totalGap = (next?.time.getTime() || 0) - current.time.getTime();
  const timePassed = now.getTime() - current.time.getTime();
  const progress = Math.min(Math.max(timePassed / totalGap, 0), 0.999);

  const diffMs = (next?.time.getTime() || 0) - now.getTime();
  const diffMin = Math.max(Math.floor(diffMs / 60000), 0);
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  return {
    nextPrayer: currentPrayer,
    nextIn: `${hours}h ${minutes}m`,
    progress,
    segmentIndex: ordered.indexOf(currentPrayer),
    segmentProgress: progress,
    passedPrayersCount: ordered.indexOf(currentPrayer),
  };
};
