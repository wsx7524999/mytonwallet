/**
 * Example component demonstrating Telegram SDK integration
 * This component shows how to use CloudStorage, Home Screen shortcuts, and Emoji Status
 * 
 * Note: This is an example file and may need to be integrated into the actual app structure
 */

import React, { memo, useEffect, useState } from '../../lib/teact/teact';

import { IS_TELEGRAM_APP } from '../../config';

import useTelegramCloudStorage from '../../util/telegram/hooks/useTelegramCloudStorage';
import useTelegramEmojiStatus from '../../util/telegram/hooks/useTelegramEmojiStatus';
import useTelegramHomeScreen from '../../util/telegram/hooks/useTelegramHomeScreen';

interface TelegramFeaturesDemoProps {
  onClose?: () => void;
}

function TelegramFeaturesDemo({ onClose }: TelegramFeaturesDemoProps) {
  // CloudStorage example - store user preference
  const {
    value: storedPreference,
    isLoading: isStorageLoading,
    error: storageError,
    setValue: setStoredPreference,
  } = useTelegramCloudStorage('demo-preference');

  // Home Screen example
  const {
    status: homeScreenStatus,
    isSupported: isHomeScreenSupported,
    isAdded: isAddedToHomeScreen,
    addToHome,
  } = useTelegramHomeScreen();

  // Emoji Status example
  const {
    isSupported: isEmojiSupported,
    hasAccess: hasEmojiAccess,
    requestAccess: requestEmojiAccess,
    setStatus: setEmojiStatus,
  } = useTelegramEmojiStatus();

  const [customValue, setCustomValue] = useState('');

  useEffect(() => {
    if (storedPreference) {
      setCustomValue(storedPreference);
    }
  }, [storedPreference]);

  if (!IS_TELEGRAM_APP) {
    return (
      <div className="TelegramFeaturesDemo">
        <h3>Telegram Features Demo</h3>
        <p>This demo is only available when running inside Telegram.</p>
      </div>
    );
  }

  const handleSavePreference = async () => {
    try {
      await setStoredPreference(customValue);
      alert('Preference saved to Telegram Cloud!');
    } catch (error) {
      alert(`Error saving: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSetEmojiStatus = async () => {
    try {
      if (hasEmojiAccess === null) {
        const granted = await requestEmojiAccess();
        if (!granted) {
          alert('Emoji status access denied');
          return;
        }
      }

      // Example custom emoji ID (you need to get valid IDs from Telegram)
      const success = await setEmojiStatus('5368324170671202286', 3600);
      if (success) {
        alert('Emoji status set successfully!');
      } else {
        alert('Failed to set emoji status');
      }
    } catch (error) {
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="TelegramFeaturesDemo">
      <h3>Telegram SDK Features Demo</h3>

      {/* CloudStorage Example */}
      <section className="demo-section">
        <h4>CloudStorage API</h4>
        {isStorageLoading ? (
          <p>Loading stored preference...</p>
        ) : storageError ? (
          <p style={{ color: 'red' }}>Error: {storageError.message}</p>
        ) : (
          <>
            <p>Stored value: {storedPreference || '(none)'}</p>
            <input
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Enter a value..."
            />
            <button onClick={handleSavePreference}>
              Save to Telegram Cloud
            </button>
            <p className="hint">
              This value will be synced across all your Telegram devices!
            </p>
          </>
        )}
      </section>

      {/* Home Screen Example */}
      <section className="demo-section">
        <h4>Home Screen Shortcuts</h4>
        {!isHomeScreenSupported ? (
          <p>Home screen shortcuts not supported on this platform</p>
        ) : isAddedToHomeScreen ? (
          <p>✓ App is already added to home screen!</p>
        ) : (
          <>
            <p>Status: {homeScreenStatus}</p>
            <button onClick={addToHome}>
              Add to Home Screen
            </button>
            <p className="hint">
              Add this app to your device's home screen for quick access!
            </p>
          </>
        )}
      </section>

      {/* Emoji Status Example */}
      <section className="demo-section">
        <h4>Emoji Status Integration</h4>
        {!isEmojiSupported ? (
          <p>Emoji status not supported on this platform</p>
        ) : (
          <>
            <p>
              Access status: {
                hasEmojiAccess === null
                  ? 'Not checked'
                  : hasEmojiAccess
                    ? 'Granted'
                    : 'Denied'
              }
            </p>
            {hasEmojiAccess === null && (
              <button onClick={requestEmojiAccess}>
                Request Access
              </button>
            )}
            {hasEmojiAccess && (
              <button onClick={handleSetEmojiStatus}>
                Set Example Emoji Status
              </button>
            )}
            <p className="hint">
              This will set your Telegram emoji status for 1 hour
            </p>
          </>
        )}
      </section>

      {onClose && (
        <button onClick={onClose} className="close-button">
          Close Demo
        </button>
      )}
    </div>
  );
}

export default memo(TelegramFeaturesDemo);
