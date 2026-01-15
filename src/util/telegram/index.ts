import type { Telegram, WebApp } from '@twa-dev/types';
import { getActions } from '../../global';

import type { GlobalState } from '../../global/types';

import { logDebugError } from '../logs';
import { getIsMobileTelegramApp } from '../windowEnvironment';
import { updateSizes } from '../windowSize';

declare global {
  interface Window {
    Telegram: Telegram;
  }
}

let webApp: WebApp | undefined;
let isBiometricInited = false;
let isNativeBiometricAuthSupported = false;
let isFaceIdAvailable = false;
let isTouchIdAvailable = false;
let disableSwipeRequests = 0;

export function initTelegramApp() {
  webApp = window.Telegram?.WebApp;

  if (!webApp) {
    logDebugError('[telegram] Can\'t initialize Telegram Mini-App');

    return;
  }

  enableTelegramMiniAppSwipeToClose();

  webApp.lockOrientation();
  webApp.SecondaryButton.setParams({ position: 'bottom' });
  webApp.BackButton.hide();
  webApp.SettingsButton.hide();
  webApp.expand();

  if (getIsMobileTelegramApp()) {
    webApp.onEvent('safeAreaChanged', updateSafeAreaProperties);
    webApp.onEvent('contentSafeAreaChanged', updateSafeAreaProperties);
  }

  webApp.onEvent('viewportChanged', updateViewport);
  updateSafeAreaProperties();
  initTelegramAppBiometric();

  webApp.ready();
}

export function initTelegramWithGlobal(global: GlobalState) {
  if (global.isFullscreen) {
    webApp!.requestFullscreen();
  }

  webApp!.onEvent('fullscreenChanged', updateFullscreenState);
  webApp!.onEvent('fullscreenFailed', onFullscreenFailed);
}

export function initTelegramAppBiometric() {
  const biometricManager = webApp?.BiometricManager;
  if (!biometricManager || isBiometricInited) return;

  isBiometricInited = true;
  biometricManager.init(() => {
    const {
      isBiometricAvailable, biometricType, isAccessGranted, isAccessRequested,
    } = biometricManager;

    isNativeBiometricAuthSupported = isBiometricAvailable && (isAccessGranted || !isAccessRequested);
    if (webApp!.platform === 'ios') {
      isFaceIdAvailable = biometricType === 'face';
      isTouchIdAvailable = biometricType === 'finger';
    }
  });
}

export function getIsTelegramBiometricAuthSupported() {
  return isNativeBiometricAuthSupported;
}

export function getIsTelegramFaceIdAvailable() {
  return isFaceIdAvailable;
}

export function getIsTelegramTouchIdAvailable() {
  return isTouchIdAvailable;
}

export function getIsTelegramBiometricsRestricted() {
  const biometricManager = webApp?.BiometricManager;
  if (!biometricManager) return undefined;

  const { isBiometricAvailable, isAccessGranted, isAccessRequested } = biometricManager;

  return isBiometricAvailable && isAccessRequested && !isAccessGranted;
}

export function getTelegramApp() {
  return webApp;
}

export function isInsideTelegram() {
  const { platform } = getTelegramApp() || {};

  return platform && platform !== 'unknown';
}

export function getTelegramAppAsync(): Promise<WebApp | undefined> {
  return new Promise((resolve) => {
    window.addEventListener('DOMContentLoaded', () => {
      resolve(getTelegramApp());
    });
  });
}

function updateViewport({ isStateStable }: { isStateStable: boolean }) {
  if (isStateStable) {
    updateSizes();
  }
}

function updateSafeAreaProperties() {
  const {
    top, left, right, bottom,
  } = webApp!.safeAreaInset;
  const {
    top: contentTop, left: contentLeft, right: contentRight, bottom: contentBottom,
  } = webApp!.contentSafeAreaInset;

  document.documentElement.style.setProperty('--safe-area-top', `${top + contentTop}px`);
  document.documentElement.style.setProperty('--safe-area-left', `${left + contentLeft}px`);
  document.documentElement.style.setProperty('--safe-area-right', `${right + contentRight}px`);
  document.documentElement.style.setProperty('--safe-area-bottom', `${bottom + contentBottom}px`);
}

function updateFullscreenState() {
  if (webApp!.isFullscreen) {
    getActions().openFullscreen();
    disableTelegramMiniAppSwipeToClose();
  } else {
    getActions().closeFullscreen();
    enableTelegramMiniAppSwipeToClose();
  }
}

function onFullscreenFailed(params: { error: 'UNSUPPORTED' | 'ALREADY_FULLSCREEN' }) {
  enableTelegramMiniAppSwipeToClose();
  // This error occurs when the user has requested fullscreen, but the application is already open fullscreen.
  // In this case, we just mark in the global that the application is running in fullscreen mode.
  if (params.error === 'ALREADY_FULLSCREEN') {
    getActions().openFullscreen();
    disableTelegramMiniAppSwipeToClose();
  }
}

export function disableTelegramMiniAppSwipeToClose() {
  disableSwipeRequests += 1;

  if (disableSwipeRequests === 1) {
    webApp?.disableVerticalSwipes();
  }
}

export function enableTelegramMiniAppSwipeToClose() {
  disableSwipeRequests = Math.max(0, disableSwipeRequests - 1);

  if (disableSwipeRequests === 0) {
    webApp?.enableVerticalSwipes();
  }
}

// CloudStorage API
export function getTelegramCloudStorage() {
  return webApp?.CloudStorage;
}

export async function setCloudStorageItem(key: string, value: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    cloudStorage.setItem(key, value, (error) => {
      if (error) {
        reject(new Error(error || 'Failed to set cloud storage item'));
      } else {
        resolve();
      }
    });
  });
}

export async function getCloudStorageItem(key: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    cloudStorage.getItem(key, (error, value) => {
      if (error) {
        reject(new Error(error || 'Failed to get cloud storage item'));
      } else {
        resolve(value || null);
      }
    });
  });
}

export async function removeCloudStorageItem(key: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    cloudStorage.removeItem(key, (error) => {
      if (error) {
        reject(new Error(error || 'Failed to remove cloud storage item'));
      } else {
        resolve();
      }
    });
  });
}

export async function getCloudStorageKeys(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    cloudStorage.getKeys((error, keys) => {
      if (error) {
        reject(new Error(error || 'Failed to get cloud storage keys'));
      } else {
        resolve(keys || []);
      }
    });
  });
}

export async function setCloudStorageItems(items: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    const itemsList = Object.entries(items).map(([key, value]) => ({ key, value }));
    cloudStorage.setItems(itemsList, (error) => {
      if (error) {
        reject(new Error(error || 'Failed to set cloud storage items'));
      } else {
        resolve();
      }
    });
  });
}

export async function removeCloudStorageItems(keys: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const cloudStorage = getTelegramCloudStorage();
    if (!cloudStorage) {
      reject(new Error('CloudStorage not available'));
      return;
    }
    
    cloudStorage.removeItems(keys, (error) => {
      if (error) {
        reject(new Error(error || 'Failed to remove cloud storage items'));
      } else {
        resolve();
      }
    });
  });
}

// Home Screen Shortcuts
export function addToHomeScreen(): void {
  webApp?.addToHomeScreen?.();
}

export function checkHomeScreenStatus(callback: (status: 'unsupported' | 'unknown' | 'added' | 'missed') => void): void {
  webApp?.checkHomeScreenStatus?.(callback);
}

// Emoji Status
export function requestEmojiStatusAccess(callback: (granted: boolean) => void): void {
  webApp?.requestEmojiStatusAccess?.(callback);
}

export function setEmojiStatus(
  customEmojiId: string,
  params?: { duration?: number },
  callback?: (success: boolean) => void,
): void {
  webApp?.setEmojiStatus?.(customEmojiId, params, callback);
}
