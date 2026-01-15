# Telegram SDK Integration

This directory contains the integration of Telegram Mini Apps SDK into MyTonWallet.

## Overview

MyTonWallet supports running as a Telegram Mini App, leveraging the full capabilities of the Telegram Web Apps platform. This integration provides access to native Telegram features like biometric authentication, cloud storage, haptic feedback, and more.

## Features

### Core Features
- **SDK Initialization** - Automatic setup when running inside Telegram
- **Biometric Authentication** - Face ID, Touch ID support via BiometricManager
- **Fullscreen Mode** - Enhanced viewing experience
- **Back Button Management** - Navigation integration with Telegram's back button
- **Theme Integration** - Automatic theme synchronization with Telegram
- **Safe Area Handling** - Proper layout with device safe areas
- **Haptic Feedback** - Native haptic responses for user interactions

### Storage
- **CloudStorage API** - Persistent storage in Telegram cloud
  - Store user preferences and non-sensitive data
  - Automatic sync across devices
  - Key-value storage with async API

### Platform Features
- **Home Screen Shortcuts** - Allow users to add app to device home screen
- **Emoji Status** - Set and manage user's Telegram emoji status
- **QR Scanner** - Native QR code scanning
- **Clipboard Access** - Read from and write to clipboard

### UI Features
- **Main/Secondary Buttons** - Native Telegram button integration
- **Swipe to Close** - Manage vertical swipe gestures
- **Viewport Management** - Handle viewport changes

## Usage

### Basic Setup

The Telegram SDK is automatically initialized when `IS_TELEGRAM_APP` environment variable is set to `'1'`:

```typescript
import { getTelegramApp, initTelegramApp } from './util/telegram';

// Initialize on app start
if (IS_TELEGRAM_APP) {
  initTelegramApp();
}

// Access the WebApp instance
const webApp = getTelegramApp();
```

### CloudStorage

Use CloudStorage to store user preferences and non-sensitive data:

```typescript
import {
  setCloudStorageItem,
  getCloudStorageItem,
  removeCloudStorageItem,
} from './util/telegram';

// Store a value
await setCloudStorageItem('theme', 'dark');

// Retrieve a value
const theme = await getCloudStorageItem('theme');

// Remove a value
await removeCloudStorageItem('theme');
```

#### React Hook

```typescript
import useTelegramCloudStorage from './util/telegram/hooks/useTelegramCloudStorage';

function MyComponent() {
  const { value, isLoading, error, setValue, removeValue } = useTelegramCloudStorage('my-key');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Value: {value}</p>
      <button onClick={() => setValue('new value')}>Update</button>
      <button onClick={removeValue}>Remove</button>
    </div>
  );
}
```

### Home Screen Shortcuts

Prompt users to add the app to their home screen:

```typescript
import { addToHomeScreen, checkHomeScreenStatus } from './util/telegram';

// Check if app can be added
checkHomeScreenStatus((status) => {
  if (status === 'missed') {
    // Show prompt to user
    addToHomeScreen();
  }
});
```

#### React Hook

```typescript
import useTelegramHomeScreen from './util/telegram/hooks/useTelegramHomeScreen';

function HomeScreenPrompt() {
  const { status, isSupported, isAdded, addToHome } = useTelegramHomeScreen();

  if (!isSupported || isAdded) return null;

  return (
    <button onClick={addToHome}>
      Add to Home Screen
    </button>
  );
}
```

### Emoji Status

Set user's Telegram emoji status:

```typescript
import { requestEmojiStatusAccess, setEmojiStatus } from './util/telegram';

// Request access first
requestEmojiStatusAccess((granted) => {
  if (granted) {
    // Set emoji status (customEmojiId from Telegram)
    setEmojiStatus('5368324170671202286', { duration: 3600 }, (success) => {
      console.log('Status set:', success);
    });
  }
});
```

#### React Hook

```typescript
import useTelegramEmojiStatus from './util/telegram/hooks/useTelegramEmojiStatus';

function EmojiStatusButton() {
  const { isSupported, hasAccess, requestAccess, setStatus } = useTelegramEmojiStatus();

  const handleSetStatus = async () => {
    if (hasAccess === null) {
      const granted = await requestAccess();
      if (!granted) return;
    }
    
    const success = await setStatus('5368324170671202286', 3600);
    console.log('Status set:', success);
  };

  if (!isSupported) return null;

  return <button onClick={handleSetStatus}>Set Emoji Status</button>;
}
```

### Biometric Authentication

```typescript
import {
  getIsTelegramBiometricAuthSupported,
  getIsTelegramFaceIdAvailable,
  getIsTelegramTouchIdAvailable,
} from './util/telegram';

// Check if biometric auth is available
const isSupported = getIsTelegramBiometricAuthSupported();
const hasFaceId = getIsTelegramFaceIdAvailable();
const hasTouchId = getIsTelegramTouchIdAvailable();
```

### Haptic Feedback

```typescript
import { getTelegramApp } from './util/telegram';

const webApp = getTelegramApp();

// Impact feedback
webApp?.HapticFeedback.impactOccurred('soft');

// Notification feedback
webApp?.HapticFeedback.notificationOccurred('success');
```

### Fullscreen Mode

```typescript
import { getTelegramApp } from './util/telegram';

const webApp = getTelegramApp();

// Request fullscreen
webApp?.requestFullscreen();

// Exit fullscreen
webApp?.exitFullscreen();

// Check if in fullscreen
const isFullscreen = webApp?.isFullscreen;
```

## Environment Variables

- `IS_TELEGRAM_APP` - Set to `'1'` to enable Telegram Mini App mode
- This triggers:
  - Loading of `telegram-web-app.js` script
  - Initialization of Telegram SDK features
  - Platform-specific UI adjustments

## Build Configuration

Telegram builds use special npm scripts:

```bash
# Development
npm run telegram:dev

# Build for production
npm run telegram:build:production

# Build for staging
npm run telegram:build:staging
```

## TypeScript Types

All Telegram SDK features are fully typed using `@twa-dev/types` package:

```typescript
import type { WebApp, Telegram } from '@twa-dev/types';

declare global {
  interface Window {
    Telegram: Telegram;
  }
}
```

## Security Considerations

- **CloudStorage** - Suitable for preferences and non-sensitive data only
- **Biometric Data** - Never stored, only used for authentication
- **initData Validation** - Always validate Telegram's initData on backend
- **Secure Storage** - Use Capacitor SecureStorage for sensitive data, not CloudStorage

## Platform Support

Telegram SDK features are available on:
- Telegram for iOS
- Telegram for Android
- Telegram Desktop (limited features)
- Telegram Web (limited features)

Feature availability varies by platform. Always check if a feature is supported before using:

```typescript
const webApp = getTelegramApp();
const isFeatureAvailable = Boolean(webApp?.featureName);
```

## References

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [@twa-dev/types Package](https://www.npmjs.com/package/@twa-dev/types)
- [Telegram Bot API](https://core.telegram.org/bots/api)
