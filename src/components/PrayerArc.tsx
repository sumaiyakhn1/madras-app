import React from "react";

const PrayerArc = ({
  segments = 5,              // number of arcs (e.g., Fajr to Isha = 5)
  activeSegment = 2,        // how many segments are "filled"
}: {
  segments?: number;
  activeSegment?: number;
}) => {
  const radius = 100;
  const strokeWidth = 13;
  const gap = 5;

  const circumference = Math.PI * radius;
  const segmentLength = (circumference - segments * gap) / segments;

  const generateArcs = () => {
    return Array.from({ length: segments }).map((_, index) => {
      const offset = index * (segmentLength + gap);
      return (
        <circle
          key={index}
          cx="50%"
          cy="50%"
          r={radius}
          fill="none"
          stroke={index < activeSegment ? "white" : "#4B5563"} // tailwind gray-700
          strokeWidth={strokeWidth}
          strokeDasharray={`${segmentLength} ${circumference}`}
          strokeDashoffset={-offset}
          transform="rotate(180 100 100)"
        />
      );
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <svg
        width="250"
        height="150"
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        {generateArcs()}
      </svg>
    </div>
  );
};

export default PrayerArc;
