import { useState, useMemo } from 'react';
import { View, Text, ScrollView, Switch, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryStore } from '@/src/stores/useInventoryStore';
import { itemDefinitions } from '@/src/data/items';
import { groupItemsByCategory, ITEM_CATEGORY_ORDER } from '@/src/utils/inventory';
import { ItemCard } from '@/src/components/inventory/ItemCard';
import type { ItemCategory } from '@/src/game/jobs/job-types';

export default function InventoryScreen() {
  const items = useInventoryStore((s) => s.items);
  const showAllItems = useInventoryStore((s) => s.showAllItems);
  const toggleShowAllItems = useInventoryStore((s) => s.toggleShowAllItems);

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | null>(null);

  // Count owned items
  const uniqueCount = Object.keys(items).length;
  const totalCount = Object.values(items).reduce((sum, qty) => sum + qty, 0);

  // Base items (after showAllItems toggle, before search/category filter)
  const baseItems = useMemo(
    () =>
      showAllItems
        ? itemDefinitions
        : itemDefinitions.filter((def) => (items[def.id] ?? 0) > 0),
    [items, showAllItems],
  );

  // Categories that have items in baseItems (for chip display)
  const availableCategories = useMemo(() => {
    const cats = new Set(baseItems.map((item) => item.category));
    return ITEM_CATEGORY_ORDER.filter((cat) => cats.has(cat.key));
  }, [baseItems]);

  // Apply search + category filter
  const filteredItems = useMemo(() => {
    let result = baseItems;
    if (searchText.trim()) {
      const query = searchText.trim().toLowerCase();
      result = result.filter((def) => def.name.toLowerCase().includes(query));
    }
    if (selectedCategory) {
      result = result.filter((def) => def.category === selectedCategory);
    }
    return result;
  }, [baseItems, searchText, selectedCategory]);

  const grouped = groupItemsByCategory(filteredItems);
  const isEmpty = uniqueCount === 0 && !showAllItems;
  const isFiltering = searchText.trim() !== '' || selectedCategory !== null;
  const noResults = !isEmpty && isFiltering && filteredItems.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-base-100" edges={['bottom']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-xs font-semibold text-neutral-content mx-4 mb-4 tracking-widest">
          INVENTORY
        </Text>

        {/* Summary */}
        <View className="flex-row mx-4 mb-3 gap-3">
          <View
            className="flex-1 rounded-xl p-4 items-center"
            style={{
              backgroundColor: '#0D1117',
              borderWidth: 1,
              borderColor: '#1E2530',
            }}
          >
            <Text className="text-xs" style={{ color: '#8899AA' }}>
              Unique Items
            </Text>
            <Text className="text-2xl font-bold text-primary mt-1">
              {uniqueCount}
            </Text>
          </View>
          <View
            className="flex-1 rounded-xl p-4 items-center"
            style={{
              backgroundColor: '#0D1117',
              borderWidth: 1,
              borderColor: '#1E2530',
            }}
          >
            <Text className="text-xs" style={{ color: '#8899AA' }}>
              Total Items
            </Text>
            <Text className="text-2xl font-bold text-secondary mt-1">
              {totalCount.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Search bar */}
        <View
          className="mx-4 mb-3 rounded-xl flex-row items-center px-3"
          style={{
            backgroundColor: '#0D1117',
            borderWidth: 1,
            borderColor: '#1E2530',
          }}
        >
          <Ionicons name="search-outline" size={16} color="#8899AA" />
          <TextInput
            className="flex-1 py-2.5 px-2 text-sm"
            style={{ color: '#ECF9FF' }}
            placeholder="Search items..."
            placeholderTextColor="#8899AA"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')}>
              <Ionicons name="close-circle" size={18} color="#8899AA" />
            </Pressable>
          )}
        </View>

        {/* Category filter chips */}
        {availableCategories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3"
            contentContainerStyle={{ gap: 8, paddingHorizontal: 16 }}
          >
            <Pressable
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={
                selectedCategory === null
                  ? { backgroundColor: '#28EBFF' }
                  : { borderWidth: 1, borderColor: '#2A3545' }
              }
              onPress={() => setSelectedCategory(null)}
            >
              <Ionicons
                name="grid-outline"
                size={14}
                color={selectedCategory === null ? '#0D1117' : '#8899AA'}
                style={{ marginRight: 4 }}
              />
              <Text
                className="text-xs font-semibold"
                style={{ color: selectedCategory === null ? '#0D1117' : '#8899AA' }}
              >
                All
              </Text>
            </Pressable>
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  className="flex-row items-center px-3 py-1.5 rounded-full"
                  style={
                    isSelected
                      ? { backgroundColor: '#28EBFF' }
                      : { borderWidth: 1, borderColor: '#2A3545' }
                  }
                  onPress={() =>
                    setSelectedCategory(isSelected ? null : cat.key)
                  }
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={14}
                    color={isSelected ? '#0D1117' : '#8899AA'}
                    style={{ marginRight: 4 }}
                  />
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: isSelected ? '#0D1117' : '#8899AA' }}
                  >
                    {cat.shortLabel}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* Discovery toggle */}
        <View
          className="mx-4 mb-3 rounded-xl px-4 py-3 flex-row items-center justify-between"
          style={{
            backgroundColor: '#0D1117',
            borderWidth: 1,
            borderColor: '#1E2530',
          }}
        >
          <Text className="text-sm" style={{ color: '#ECF9FF' }}>
            Show all items
          </Text>
          <Switch
            value={showAllItems}
            onValueChange={toggleShowAllItems}
            trackColor={{ false: '#1E2530', true: '#28EBFF44' }}
            thumbColor={showAllItems ? '#28EBFF' : '#8899AA'}
          />
        </View>

        {/* Empty state (no items owned at all) */}
        {isEmpty && (
          <View className="items-center justify-center py-16 mx-4">
            <Text className="text-base font-semibold mb-2" style={{ color: '#8899AA' }}>
              No items yet
            </Text>
            <Text className="text-sm text-center" style={{ color: '#5A6A7A' }}>
              Complete activities to gather resources.
            </Text>
          </View>
        )}

        {/* No results from filter */}
        {noResults && (
          <View className="items-center justify-center py-16 mx-4">
            <Text className="text-base font-semibold mb-2" style={{ color: '#8899AA' }}>
              No items match your search
            </Text>
            <Text className="text-sm text-center" style={{ color: '#5A6A7A' }}>
              Try a different search term or category.
            </Text>
          </View>
        )}

        {/* Items grouped by category */}
        {grouped.map(({ key, label, items: categoryItems }) => (
          <View key={key}>
            <Text
              className="text-xs font-semibold mx-4 mt-4 mb-2 tracking-widest"
              style={{ color: '#8899AA' }}
            >
              {label}
            </Text>
            {categoryItems.map((def) => {
              const quantity = items[def.id] ?? 0;
              return (
                <ItemCard
                  key={def.id}
                  item={def}
                  quantity={quantity}
                  isUndiscovered={quantity === 0}
                />
              );
            })}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
