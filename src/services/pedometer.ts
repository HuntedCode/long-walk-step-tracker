import { Platform } from 'react-native';
import { Pedometer } from 'expo-sensors';
import type { EventSubscription } from 'expo-modules-core';
import type * as AndroidPedometerType from 'expo-android-pedometer';
import type { PedometerPermissionStatus } from '@/src/types/steps';

let _androidPedometer: typeof AndroidPedometerType | null = null;
function getAndroidPedometer(): typeof AndroidPedometerType {
  if (!_androidPedometer) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    _androidPedometer = require('expo-android-pedometer');
  }
  return _androidPedometer!;
}

/**
 * Platform-abstracted pedometer service.
 *
 * Android: uses expo-android-pedometer (foreground service + TYPE_STEP_COUNTER).
 * iOS: uses expo-sensors Pedometer (Core Motion).
 * Web: returns unavailable (use StepSimulator).
 */

/**
 * Check if the hardware pedometer is available on this device.
 */
export async function isPedometerAvailable(): Promise<boolean> {
  if (Platform.OS === 'android') {
    try {
      return await getAndroidPedometer().isSensorAvailable();
    } catch {
      return false;
    }
  }
  if (Platform.OS === 'ios') {
    try {
      return await Pedometer.isAvailableAsync();
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Request pedometer permission from the user.
 *
 * Android: requests ACTIVITY_RECOGNITION + POST_NOTIFICATIONS.
 * iOS: requests Core Motion permission.
 */
export async function requestPedometerPermission(): Promise<PedometerPermissionStatus> {
  if (Platform.OS === 'android') {
    try {
      const activityResult = await getAndroidPedometer().requestActivityPermissions();
      if (!activityResult.granted) return 'denied';
      // Notification permission is needed for the foreground service notification
      await getAndroidPedometer().requestNotificationPermissions();
      return 'granted';
    } catch {
      return 'denied';
    }
  }
  if (Platform.OS === 'ios') {
    try {
      const result = await Pedometer.requestPermissionsAsync();
      return result.status as PedometerPermissionStatus;
    } catch {
      return 'denied';
    }
  }
  return 'denied';
}

/**
 * Subscribe to real-time step count updates.
 *
 * Android: uses expo-android-pedometer subscribeToChanges.
 *   Callback receives { steps: number } where steps is TODAY's total.
 * iOS: uses expo-sensors Pedometer.watchStepCount.
 *   Callback receives { steps: number } where steps is CUMULATIVE since subscription start.
 */
export function subscribeToPedometer(
  callback: (result: { steps: number }) => void,
): EventSubscription {
  if (Platform.OS === 'android') {
    return getAndroidPedometer().subscribeToChanges((event) => {
      callback({ steps: event.steps });
    });
  }
  return Pedometer.watchStepCount(callback);
}

/**
 * Start background step tracking (Android only).
 * Launches a foreground service with a persistent notification.
 * No-op on iOS/web.
 */
export async function startBackgroundTracking(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  try {
    return await getAndroidPedometer().setupBackgroundUpdates({
      contentTemplate: '%d steps today',
    });
  } catch {
    return false;
  }
}

/**
 * Get today's total step count from the native pedometer.
 *
 * Android: queries expo-android-pedometer's local step database.
 * iOS: queries Core Motion via expo-sensors.
 *
 * Returns null if unavailable.
 */
export async function getTodaySteps(): Promise<number | null> {
  if (Platform.OS === 'android') {
    try {
      return await getAndroidPedometer().getStepsCountAsync();
    } catch {
      return null;
    }
  }
  if (Platform.OS === 'ios') {
    try {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const result = await Pedometer.getStepCountAsync(start, new Date());
      return result.steps;
    } catch {
      return null;
    }
  }
  return null;
}
