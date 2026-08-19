import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "molu_notification_preferences";

export interface NotificationPreferences {
  orderUpdates: boolean;
  promotions: boolean;
  securityAlerts: boolean;
  newsletter: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  orderUpdates: true,
  promotions: true,
  securityAlerts: true,
  newsletter: false,
};

/**
 * useNotificationPreferences
 * -----------------------------------------------------------------------
 * Same shape as useRecentSearches/useRecentlyViewed — localStorage-backed,
 * loads synchronously-ish via lazy effect, persists on every change.
 * Swap for a real PATCH /users/me/notification-preferences call later;
 * the page component doesn't need to change, just this hook's internals.
 */
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
    } catch {
      // corrupted value or storage unavailable — fall back to defaults
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // e.g. private browsing storage limits — fail silently
    }
  }, [preferences, isLoaded]);

  const setPreference = useCallback(
    <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return { preferences, setPreference };
}