import { useEffect, useState } from '../../../lib/teact/teact';

import {
  getCloudStorageItem,
  getCloudStorageKeys,
  getTelegramCloudStorage,
  removeCloudStorageItem,
  setCloudStorageItem,
} from '../index';

import useLastCallback from '../../../hooks/useLastCallback';

interface UseCloudStorageReturn {
  value: string | null;
  isLoading: boolean;
  error: Error | null;
  setValue: (newValue: string) => Promise<void>;
  removeValue: () => Promise<void>;
}

export default function useTelegramCloudStorage(key: string): UseCloudStorageReturn {
  const [value, setValueState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      setError(new Error('CloudStorage not available'));
      setIsLoading(false);
      return;
    }

    const loadValue = async () => {
      try {
        const storedValue = await getCloudStorageItem(key);
        setValueState(storedValue);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load cloud storage value'));
      } finally {
        setIsLoading(false);
      }
    };

    void loadValue();
  }, [key]);

  const setValue = useLastCallback(async (newValue: string) => {
    setIsLoading(true);
    try {
      await setCloudStorageItem(key, newValue);
      setValueState(newValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to set cloud storage value'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  });

  const removeValue = useLastCallback(async () => {
    setIsLoading(true);
    try {
      await removeCloudStorageItem(key);
      setValueState(null);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove cloud storage value'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  });

  return {
    value,
    isLoading,
    error,
    setValue,
    removeValue,
  };
}

export function useTelegramCloudStorageKeys() {
  const [keys, setKeys] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useLastCallback(async () => {
    setIsLoading(true);
    try {
      const cloudKeys = await getCloudStorageKeys();
      setKeys(cloudKeys);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get cloud storage keys'));
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    keys,
    isLoading,
    error,
    refresh,
  };
}
