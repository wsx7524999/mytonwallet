import { useState } from '../../../lib/teact/teact';

import { getTelegramApp, requestEmojiStatusAccess, setEmojiStatus } from '../index';

import useLastCallback from '../../../hooks/useLastCallback';

interface UseEmojiStatusReturn {
  isSupported: boolean;
  hasAccess: boolean | null;
  requestAccess: () => Promise<boolean>;
  setStatus: (customEmojiId: string, duration?: number) => Promise<boolean>;
}

export default function useTelegramEmojiStatus(): UseEmojiStatusReturn {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const webApp = getTelegramApp();
  const isSupported = Boolean(webApp?.setEmojiStatus);

  const requestAccess = useLastCallback(async () => {
    if (!isSupported) return false;

    return new Promise<boolean>((resolve) => {
      requestEmojiStatusAccess((granted) => {
        setHasAccess(granted);
        resolve(granted);
      });
    });
  });

  const setStatus = useLastCallback(async (customEmojiId: string, duration?: number) => {
    if (!isSupported) return false;

    // If we haven't checked access yet, request it first
    if (hasAccess === null) {
      const granted = await requestAccess();
      if (!granted) return false;
    } else if (!hasAccess) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      setEmojiStatus(
        customEmojiId,
        duration ? { duration } : undefined,
        (success) => {
          resolve(success);
        },
      );
    });
  });

  return {
    isSupported,
    hasAccess,
    requestAccess,
    setStatus,
  };
}
