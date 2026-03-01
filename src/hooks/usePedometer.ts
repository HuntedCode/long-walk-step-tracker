import { useEffect, useRef, useCallback, useState } from 'react';
import { AppState, Platform } from 'react-native';
import type { AppStateStatus } from 'react-native';
import type { EventSubscription } from 'expo-modules-core';
import {
  isPedometerAvailable,
  requestPedometerPermission,
  subscribeToPedometer,
  startBackgroundTracking,
  getTodaySteps,
} from '@/src/services/pedometer';
import { useStepStore } from '@/src/stores/useStepStore';
import type { PedometerPermissionStatus } from '@/src/types/steps';

export interface BackfillDebugInfo {
  lastAttempt: string | null;
  stepsReturned: number | null;
  error: string | null;
}

interface UsePedometerResult {
  isAvailable: boolean;
  permissionStatus: PedometerPermissionStatus;
  isTracking: boolean;
  error: string | null;
  backfillDebug: BackfillDebugInfo;
  requestPermission: () => Promise<void>;
}

export function usePedometer(): UsePedometerResult {
  const [isAvailable, setIsAvailable] = useState(false);
  const [permissionStatus, setPermissionStatus] =
    useState<PedometerPermissionStatus>('undetermined');
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backfillDebug, setBackfillDebug] = useState<BackfillDebugInfo>({
    lastAttempt: null,
    stepsReturned: null,
    error: null,
  });

  const subscriptionRef = useRef<EventSubscription | null>(null);
  const lastCumulativeRef = useRef<number>(-1);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);

  const addSteps = useStepStore((s) => s.addSteps);
  const backfillToday = useStepStore((s) => s.backfillToday);
  const checkDayRollover = useStepStore((s) => s.checkDayRollover);

  const startTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }

    lastCumulativeRef.current = -1;

    subscriptionRef.current = subscribeToPedometer((result) => {
      if (Platform.OS === 'android') {
        // Android (expo-android-pedometer): steps is today's total
        backfillToday(result.steps);
      } else {
        // iOS (expo-sensors): steps is cumulative since subscription start
        if (lastCumulativeRef.current < 0) {
          lastCumulativeRef.current = result.steps;
          return;
        }
        const delta = result.steps - lastCumulativeRef.current;
        lastCumulativeRef.current = result.steps;
        if (delta > 0) {
          addSteps(delta);
        }
      }
    });

    setIsTracking(true);
  }, [addSteps, backfillToday]);

  const stopTracking = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
    setIsTracking(false);
  }, []);

  const recoverBackgroundSteps = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    try {
      const totalToday = await getTodaySteps();
      setBackfillDebug({
        lastAttempt: timestamp,
        stepsReturned: totalToday,
        error: null,
      });
      if (totalToday !== null && totalToday > 0) {
        backfillToday(totalToday);
      }
    } catch (e) {
      setBackfillDebug({
        lastAttempt: timestamp,
        stepsReturned: null,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }, [backfillToday]);

  const requestPermission = useCallback(async () => {
    const status = await requestPedometerPermission();
    setPermissionStatus(status);
    if (status === 'granted') {
      setError(null);
      await startBackgroundTracking();
      await recoverBackgroundSteps();
      startTracking();
    } else if (status === 'denied') {
      setError('Step tracking permission denied. Enable it in Settings.');
    }
  }, [recoverBackgroundSteps, startTracking]);

  // --- Initialization (runs once on mount) ---
  useEffect(() => {
    let mounted = true;

    async function init() {
      const available = await isPedometerAvailable();
      if (!mounted) return;
      setIsAvailable(available);

      if (!available) {
        setError(
          'Pedometer not available on this device. Use the simulator below to add steps manually.',
        );
        return;
      }

      const status = await requestPedometerPermission();
      if (!mounted) return;
      setPermissionStatus(status);

      if (status === 'granted') {
        await startBackgroundTracking();
        await recoverBackgroundSteps();
        if (!mounted) return;
        startTracking();
      } else if (status === 'denied') {
        setError('Step tracking permission denied. Enable it in Settings.');
      }
    }

    init();

    return () => {
      mounted = false;
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // --- App state handling (foreground/background) ---
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextAppState: AppStateStatus) => {
        const wasBackground =
          appStateRef.current === 'background' ||
          appStateRef.current === 'inactive';
        const isNowActive = nextAppState === 'active';

        if (wasBackground && isNowActive) {
          checkDayRollover();
          if (permissionStatus === 'granted' && isAvailable) {
            await recoverBackgroundSteps();
            startTracking();
          }
        } else if (
          nextAppState === 'background' ||
          nextAppState === 'inactive'
        ) {
          stopTracking();
        }

        appStateRef.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [
    permissionStatus,
    isAvailable,
    checkDayRollover,
    recoverBackgroundSteps,
    startTracking,
    stopTracking,
  ]);

  return {
    isAvailable,
    permissionStatus,
    isTracking,
    error,
    backfillDebug,
    requestPermission,
  };
}
