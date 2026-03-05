import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';

const PARTICLE_COUNT = 12;
const COLORS = ['#00C853', '#FFD700', '#28EBFF'] as const;
const DURATION = 700;

interface GoalCelebrationProps {
  active: boolean;
  size: number;
}

interface ParticleProps {
  index: number;
  size: number;
  progress: SharedValue<number>;
}

function Particle({ index, size, progress }: ParticleProps) {
  const angle = (index / PARTICLE_COUNT) * 2 * Math.PI;
  const color = COLORS[index % COLORS.length];
  const startRadius = 0;
  const endRadius = size / 2 + 60;

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const radius = startRadius + (endRadius - startRadius) * p;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    return {
      position: 'absolute' as const,
      left: size / 2 + x - 4,
      top: size / 2 + y - 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: color,
      opacity: 1 - p,
      transform: [{ scale: 1 - p * 0.7 }],
    };
  });

  return <Animated.View style={style} />;
}

export function GoalCelebration({ active, size }: GoalCelebrationProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (active) {
      progress.value = 0;
      progress.value = withDelay(
        100,
        withTiming(1, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
      );
    }
  }, [active]);

  if (!active) return null;

  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size,
        overflow: 'visible',
        zIndex: 10,
        elevation: 10,
      }}
      pointerEvents="none"
    >
      {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
        <Particle key={i} index={i} size={size} progress={progress} />
      ))}
    </View>
  );
}
