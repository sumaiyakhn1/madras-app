import React, { useRef, useEffect, useState } from "react";
import {
  Clock,
  Sun,
  CloudMoon,
  SunDim,
  CloudSun,
} from "phosphor-react";
import { formatTo12Hour } from "../utils/formatTo12Hour";
interface Props {
  prayerName: string;
  nextIn: string;
  timings: { [key: string]: string };
  active: string;
  day: string;
  passedPrayersCount: number;
  segmentProgress: number; // Value from 0 to 1
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
  const currentPathRef = useRef<SVGPathElement | null>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (currentPathRef.current) {
      setPathLength(currentPathRef.current.getTotalLength());
    }
  }, [passedPrayersCount]);

  return (
    <div
      className={`rounded-2xl p-4 text-white w-full max-w-sm shadow-lg bg-gradient-to-br ${gradientMap[prayerName]}`}
    >
      {/* Header */}
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
            <p>{formatTo12Hour(time)}</p>
          </div>
        ))}
      </div>

      {/* Progress Arc */}
      <div className="mt-2 w-full h-40 relative pointer-events-none overflow-hidden">
        <svg viewBox="0 0 300 150" className="w-full h-full">
          {Array.from({ length: 5 }).map((_, i) => {
            const radius = 130;
            const centerX = 150;
            const centerY = 150;
            const totalSegments = 5;
            const gapDeg = 6;
            const gapAngle = (gapDeg * Math.PI) / 180;
            const totalArc = Math.PI;
            const totalGap = gapAngle * (totalSegments - 1);
            const arcAngle = (totalArc - totalGap) / totalSegments;

            const startAngle = Math.PI + i * (arcAngle + gapAngle);
            const endAngle = startAngle + arcAngle;

            const startX = centerX + radius * Math.cos(startAngle);
            const startY = centerY + radius * Math.sin(startAngle);
            const endX = centerX + radius * Math.cos(endAngle);
            const endY = centerY + radius * Math.sin(endAngle);

            const path = `
              M ${startX} ${startY}
              A ${radius} ${radius} 0 0 1 ${endX} ${endY}
            `;

            const isFilled = i < passedPrayersCount;
            const isCurrent = i === passedPrayersCount;

            if (isFilled) {
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke="white"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
              );
            } else if (isCurrent) {
              return (
                <g key={i}>
                  {/* Background of current segment */}
                  <path
                    d={path}
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="13"
                    strokeLinecap="round"
                  />
                  {/* Progress path */}
                  <path
                    ref={currentPathRef}
                    d={path}
                    fill="none"
                    stroke="white"
                    strokeWidth="13"
                    strokeLinecap="round"
                    strokeDasharray={pathLength}
                    strokeDashoffset={pathLength * (1 - segmentProgress)}
                    style={{
                      transition: "stroke-dashoffset 0.3s ease",
                    }}
                  />
                </g>
              );
            } else {
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
              );
            }
          })}
        </svg>
      </div>
    </div>
  );
};

export default PrayerCard;
