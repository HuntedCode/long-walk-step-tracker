import { View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import type { ItemDefinition } from '@/src/game/jobs/job-types';
import { RARITY_COLORS, RARITY_LABELS } from '@/src/utils/inventory';

interface ItemCardProps {
  item: ItemDefinition;
  quantity: number;
  /** True when the player has never obtained this item (shown as ???). */
  isUndiscovered: boolean;
}

export function ItemCard({ item, quantity, isUndiscovered }: ItemCardProps) {
  const accentColor = RARITY_COLORS[item.rarity];
  const textColor = '#ECF9FF';
  const descColor = '#8899AA';

  return (
    <View
      className="mx-4 mb-3 rounded-xl overflow-hidden"
      style={{
        backgroundColor: '#0D1117',
        borderWidth: 1,
        borderColor: '#1E2530',
        opacity: isUndiscovered ? 0.5 : 1,
      }}
    >
      {/* Colored left accent bar */}
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          backgroundColor: accentColor,
          opacity: isUndiscovered ? 0.3 : 0.6,
        }}
      />

      <View className="pl-5 pr-4 py-3 flex-row items-center gap-3">
        {/* Icon slot */}
        <View
          className="items-center justify-center rounded-lg"
          style={{
            width: 44,
            height: 44,
            backgroundColor: isUndiscovered ? '#1E2530' : accentColor + '15',
          }}
        >
          {isUndiscovered ? (
            <Ionicons name="help-circle-outline" size={26} color={descColor} />
          ) : item.iconLibrary === 'MaterialCommunityIcons' ? (
            <MaterialCommunityIcons name={item.icon as any} size={26} color={accentColor} />
          ) : (
            <Ionicons name={item.icon as any} size={26} color={accentColor} />
          )}
        </View>

        {/* Text content */}
        <View className="flex-1">
          {/* Name + quantity row */}
          <View className="flex-row items-center justify-between">
            <Text
              className="text-sm font-bold flex-1"
              style={{ color: isUndiscovered ? descColor : textColor }}
              numberOfLines={1}
            >
              {isUndiscovered ? '???' : item.name}
            </Text>
            {!isUndiscovered && (
              <Text className="text-lg font-bold ml-2" style={{ color: accentColor }}>
                x{quantity.toLocaleString()}
              </Text>
            )}
          </View>

          {/* Rarity + value */}
          <Text className="text-xs" style={{ color: isUndiscovered ? descColor : accentColor }}>
            {isUndiscovered
              ? '???'
              : `${RARITY_LABELS[item.rarity]}${item.value > 0 ? ` · ${item.value} val` : ''}`}
          </Text>

          {/* Description */}
          <Text
            className="text-xs mb-2"
            style={{ color: descColor, minHeight: 32 }}
            numberOfLines={2}
          >
            {isUndiscovered ? 'Not yet discovered.' : item.description}
          </Text>
        </View>
      </View>
    </View>
  );
}
