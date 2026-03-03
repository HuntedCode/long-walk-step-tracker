import { View } from 'react-native';

interface ProgressBarProps {
  /** Progress fraction from 0 to 1. */
  progress: number;
  /** Tailwind background color class for the fill (e.g. 'bg-primary'). */
  color?: string;
  /** Tailwind height class (e.g. 'h-2', 'h-3'). Defaults to 'h-2'. */
  height?: string;
}

export function ProgressBar({
  progress,
  color = 'bg-primary',
  height = 'h-2',
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  // Round to 1 decimal place as a number so the template literal
  // satisfies RN's DimensionValue type (`${number}%`).
  const pct = Math.round(clamped * 1000) / 10;

  return (
    <View className={`${height} bg-base-300 rounded-full overflow-hidden`}>
      <View
        className={`h-full rounded-full ${color}`}
        style={{ width: `${pct}%` }}
      />
    </View>
  );
}
