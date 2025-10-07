/**
 * Client-side Device Fingerprinting Utilities
 * Tạo device token từ phía client để gửi lên server
 */

/**
 * Lấy thông tin trình duyệt và OS
 */
function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  const vendor = navigator.vendor;
  
  return {
    userAgent,
    platform,
    vendor,
  };
}

/**
 * Lấy thông tin màn hình
 */
function getScreenInfo() {
  return {
    width: screen.width,
    height: screen.height,
    colorDepth: screen.colorDepth,
    pixelRatio: window.devicePixelRatio,
  };
}

/**
 * Lấy timezone
 */
function getTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Lấy ngôn ngữ
 */
function getLanguage() {
  return navigator.language || navigator.languages[0];
}

/**
 * Tạo device fingerprint từ các thông tin trên
 */
async function generateFingerprint(): Promise<string> {
  const browser = getBrowserInfo();
  const screen = getScreenInfo();
  const timezone = getTimezone();
  const language = getLanguage();

  const fingerprintData = JSON.stringify({
    ...browser,
    ...screen,
    timezone,
    language,
  });

  // Hash dữ liệu bằng SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(fingerprintData);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Lấy hoặc tạo device token từ localStorage
 */
export async function getDeviceToken(): Promise<string> {
  // Kiểm tra xem đã có device token chưa
  let deviceToken = localStorage.getItem('device_token');

  if (!deviceToken) {
    // Tạo mới device token
    deviceToken = await generateFingerprint();
    localStorage.setItem('device_token', deviceToken);
  }

  return deviceToken;
}

/**
 * Xóa device token (khi user logout hoặc không muốn ghi nhớ nữa)
 */
export function clearDeviceToken(): void {
  localStorage.removeItem('device_token');
}

/**
 * Kiểm tra xem thiết bị này có được ghi nhớ không
 */
export function hasRememberedDevice(): boolean {
  return localStorage.getItem('device_token') !== null;
}
