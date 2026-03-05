import { useEffect } from 'react';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface GoalRingProps {
  /** Progress fraction from 0 to 1. */
  progress: number;
  /** Diameter of the ring in pixels. */
  size: number;
  /** Stroke width in pixels. */
  strokeWidth?: number;
  /** Color of the filled arc. */
  color?: string;
  /** Color of the background track. */
  trackColor?: string;
  /** Trigger a brief scale pulse (e.g. on goal met). */
  pulse?: boolean;
  /** Content to render inside the ring. */
  children?: React.ReactNode;
}

const TIMING_CONFIG = { duration: 600, easing: Easing.out(Easing.cubic) };

export function GoalRing({
  progress,
  size,
  strokeWidth = 8,
  color = '#28EBFF',
  trackColor = '#2A323C',
  pulse = false,
  children,
}: GoalRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedOffset = useSharedValue(circumference);
  const scale = useSharedValue(1);

  useEffect(() => {
    const clamped = Math.max(0, Math.min(1, progress));
    const target = circumference * (1 - clamped);
    animatedOffset.value = withTiming(target, TIMING_CONFIG);
  }, [progress, circumference]);

  useEffect(() => {
    if (pulse) {
      scale.value = withSequence(
        withTiming(1.08, { duration: 200 }),
        withTiming(1, { duration: 200 }),
      );
    }
  }, [pulse]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: animatedOffset.value,
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
        pulseStyle,
      ]}
    >
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        {/* Background track */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated progress arc */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
          animatedProps={animatedProps}
        />
      </Svg>
      {children}
    </Animated.View>
  );
}
