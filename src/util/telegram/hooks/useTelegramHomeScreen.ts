import { useEffect, useState } from '../../../lib/teact/teact';

import { addToHomeScreen, checkHomeScreenStatus, getTelegramApp } from '../index';

import useLastCallback from '../../../hooks/useLastCallback';

type HomeScreenStatus = 'unsupported' | 'unknown' | 'added' | 'missed';

interface UseHomeScreenReturn {
  status: HomeScreenStatus | null;
  isSupported: boolean;
  isAdded: boolean;
  addToHome: () => void;
  checkStatus: () => void;
}

export default function useTelegramHomeScreen(): UseHomeScreenReturn {
  const [status, setStatus] = useState<HomeScreenStatus | null>(null);
  const webApp = getTelegramApp();
  const isSupported = Boolean(webApp?.addToHomeScreen);

  useEffect(() => {
    if (!isSupported) {
      setStatus('unsupported');
      return;
    }

    checkHomeScreenStatus((homeStatus) => {
      setStatus(homeStatus);
    });
  }, [isSupported]);

  const addToHome = useLastCallback(() => {
    if (!isSupported) return;
    
    addToHomeScreen();
    
    // After adding, check status again after a short delay
    setTimeout(() => {
      checkHomeScreenStatus((homeStatus) => {
        setStatus(homeStatus);
      });
    }, 1000);
  });

  const checkStatus = useLastCallback(() => {
    if (!isSupported) return;
    
    checkHomeScreenStatus((homeStatus) => {
      setStatus(homeStatus);
    });
  });

  return {
    status,
    isSupported,
    isAdded: status === 'added',
    addToHome,
    checkStatus,
  };
}
