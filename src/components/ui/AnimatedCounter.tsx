import { useEffect, useMemo, useState } from 'react';
import { Text } from 'react-native';
import {
  useSharedValue,
  withTiming,
  useAnimatedReaction,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

interface AnimatedCounterProps {
  /** Target number to count up to. */
  to: number;
  /** Animation duration in ms. */
  duration?: number;
  /** NativeWind className passed to the Text element. */
  className?: string;
}

const DEFAULT_EASING = Easing.out(Easing.cubic);
const TIMING_CONFIG = { duration: 600, easing: DEFAULT_EASING };

export function AnimatedCounter({
  to,
  duration = 600,
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState('0');
  const animatedValue = useSharedValue(0);

  const config = useMemo(
    () => duration === 600 ? TIMING_CONFIG : { duration, easing: DEFAULT_EASING },
    [duration],
  );

  useEffect(() => {
    animatedValue.value = withTiming(to, config);
  }, [to, config]);

  useAnimatedReaction(
    () => Math.round(animatedValue.value),
    (current, previous) => {
      if (current !== previous) {
        runOnJS(setDisplay)(current.toLocaleString());
      }
    },
    [animatedValue],
  );

  return <Text className={className}>{display}</Text>;
}
