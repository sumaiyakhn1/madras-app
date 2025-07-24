import React from "react";
import {
  Clock,
  Sun,
  CloudMoon,
  SunDim,
  CloudSun,
} from "phosphor-react";

interface Props {
  prayerName: string;
  nextIn: string;
  timings: { [key: string]: string };
  active: string;
  day: string;
  passedPrayersCount: number;
  segmentProgress: number;
}

const iconMap: Record<string, React.ReactNode> = {
  Fajr: <CloudMoon size={18} />,
  Dhuhr: <Sun size={18} />,
  Asr: <SunDim size={18} />,
  Maghrib: <CloudSun size={18} />,
  Isha: <Clock size={18} />,
};

const gradientMap: Record<string, string> = {
  Fajr: "from-indigo-400 to-blue-500",
  Dhuhr: "from-yellow-400 to-orange-400",
  Asr: "from-green-400 to-emerald-500",
  Maghrib: "from-orange-400 to-pink-400",
  Isha: "from-purple-600 to-indigo-700",
};

const PrayerCard = ({
  prayerName,
  nextIn,
  timings,
  active,
  day,
  passedPrayersCount,
  segmentProgress,
}: Props) => {
  const safeProgress = Math.min(
    (passedPrayersCount + segmentProgress) / 5,
    0.999
  );

  return (
    <div
      className={`rounded-2xl p-4 text-white w-full max-w-sm shadow-lg bg-gradient-to-br ${gradientMap[prayerName]}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold flex items-center gap-1">
            {iconMap[prayerName]} {prayerName}
          </h2>
          <p className="text-sm text-white/90">Next prayer in {nextIn}</p>
        </div>
        <div className="text-xs bg-white/20 px-2 py-1 rounded-full">{day}</div>
      </div>

      {/* Prayer times row */}
      <div className="flex justify-between mt-4 text-xs">
        {Object.entries(timings).map(([name, time]) => (
          <div
            key={name}
            className={`flex flex-col items-center ${
              name === active ? "text-white font-semibold" : "text-white/70"
            }`}
          >
            <div className="mb-1">{iconMap[name]}</div>
            <p>{name}</p>
            <p>{time}</p>
          </div>
        ))}
      </div>

      {/* Progress Arc */}
      <div className="mt-6 w-full h-24 relative overflow-hidden">
      <svg viewBox="0 0 100 50" className="w-full h-full">
  {Array.from({ length: 5 }).map((_, i) => {
    const startAngle = 180 * (i / 5);
    const endAngle = 180 * ((i + 1) / 5);
    const radius = 40;
    const centerX = 50;
    const centerY = 50;

    const startX = centerX + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = centerY + radius * Math.sin((Math.PI * startAngle) / 180);
    const endX = centerX + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = centerY + radius * Math.sin((Math.PI * endAngle) / 180);

    const isFilled = i < passedPrayersCount;
    const isCurrent = i === passedPrayersCount;

    return (
      <path
        key={i}
        d={`M ${startX} ${startY} A ${radius} ${radius} 0 0 1 ${endX} ${endY}`}
        fill="none"
        stroke={
          isFilled
            ? "white"
            : isCurrent
            ? "white"
            : "rgba(255,255,255,0.2)"
        }
        strokeWidth="8"
        strokeLinecap="round"
        {...(isCurrent
          ? {
              strokeDasharray: `${125 / 5}`,
              strokeDashoffset: `${125 / 5 * (1 - segmentProgress)}`,
            }
          : {})}
        style={{
          transition: "stroke-dashoffset 0.5s ease",
        }}
      />
    );
  })}
</svg>

      </div>
    </div>
  );
};

export default PrayerCard;
