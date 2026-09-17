import React from 'react';

interface RiskGaugeProps {
  score: number;
  size?: number;
  label?: string;
  showCategory?: boolean;
  comparativeScore?: number; // e.g. for counterfactual before / after
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  size = 110,
  label = 'Ripple Risk',
  showCategory = true,
  comparativeScore,
}) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (val: number) => {
    if (val >= 85) return '#EF4444'; // Red
    if (val >= 70) return '#F97316'; // Orange
    if (val >= 40) return '#F59E0B'; // Yellow
    return '#22C55E'; // Green
  };

  const getCategory = (val: number) => {
    if (val >= 85) return 'CRITICAL';
    if (val >= 70) return 'HIGH';
    if (val >= 40) return 'MEDIUM';
    return 'LOW';
  };

  const primaryColor = getColor(score);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#192333"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Active progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={primaryColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
          {/* Comparative arc if provided */}
          {comparativeScore !== undefined && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#22D3EE"
              strokeWidth={strokeWidth / 2}
              strokeDasharray={circumference}
              strokeDashoffset={circumference - (comparativeScore / 100) * circumference}
              strokeLinecap="round"
              strokeDashoffset-delay="200ms"
              fill="transparent"
              className="opacity-70"
            />
          )}
        </svg>

        {/* Center label & score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl font-bold tracking-tight text-slate-100">
            {score}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            / 100
          </span>
        </div>
      </div>

      {label && (
        <div className="mt-2 text-center">
          <span className="text-xs text-slate-400 font-medium block">{label}</span>
          {showCategory && (
            <span
              className="text-[11px] font-mono font-bold tracking-wider"
              style={{ color: primaryColor }}
            >
              {getCategory(score)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
