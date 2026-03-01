import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

/**
 * Shared Zustand persistence storage backed by AsyncStorage.
 * All stores import this to ensure consistent serialization.
 * To migrate to MMKV later, swap the AsyncStorage import here.
 */
export const zustandStorage = createJSONStorage(() => AsyncStorage);
