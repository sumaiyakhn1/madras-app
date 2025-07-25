export const getNextPrayer = (timings: { [key: string]: string }) => {
  const now = new Date();
  const ordered = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

  const prayerTimes = ordered.map((name) => {
    const [hour, minute] = timings[name].split(":").map(Number);
    const date = new Date(now);
    date.setHours(hour, minute, 0, 0);
    return { name, time: date };
  });

  let next = prayerTimes.find((p) => p.time > now);
  let prev: Date;

  if (!next) {
    const fajrTime = new Date(prayerTimes[0].time);
    fajrTime.setDate(fajrTime.getDate() + 1);
    next = { name: "Fajr", time: fajrTime };
    prev = prayerTimes[prayerTimes.length - 1].time;
  } else {
    const nextIndex = ordered.indexOf(next.name);
    const prevIndex = (nextIndex - 1 + ordered.length) % ordered.length;
    prev = prayerTimes[prevIndex].time;
  }

  const totalGap = next.time.getTime() - prev.getTime();
  const timePassed = now.getTime() - prev.getTime();
  const rawProgress = timePassed / totalGap;
  const progress = Math.min(Math.max(rawProgress, 0), 0.999);

  const diffMs = next.time.getTime() - now.getTime();
  const diffMin = Math.max(Math.floor(diffMs / 60000), 0);
  const hours = Math.floor(diffMin / 60);
  const minutes = diffMin % 60;

  const passedPrayersCount = ordered.indexOf(next.name);
  const segmentProgress = progress;

  return {
    nextPrayer: next.name,
    nextIn: `${hours}h ${minutes}m`,
    progress,
    segmentIndex: passedPrayersCount,
    segmentProgress,
    passedPrayersCount,
  };
};
