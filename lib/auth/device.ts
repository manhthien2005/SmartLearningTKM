import { createHash } from 'crypto';
import { UAParser } from 'ua-parser-js';

/**
 * Tạo device fingerprint từ thông tin request
 * Device fingerprint = hash của (user-agent + ip + một số thông tin khác)
 */
export function generateDeviceFingerprint(userAgent: string, ipAddress: string): string {
  const fingerprint = `${userAgent}-${ipAddress}`;
  return createHash('sha256').update(fingerprint).digest('hex');
}

/**
 * Parse thông tin thiết bị từ user agent
 */
export function parseDeviceInfo(userAgent: string) {
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const browser = result.browser.name || 'Unknown Browser';
  const os = result.os.name || 'Unknown OS';
  const deviceType = result.device.type || 'desktop'; // desktop, mobile, tablet

  return {
    device_name: `${browser} on ${os}`,
    device_type: deviceType,
    user_agent: userAgent,
  };
}

/**
 * Lấy IP address từ request headers
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Kiểm tra device token có hợp lệ không
 */
export function validateDeviceToken(token: string): boolean {
  // Device token phải là chuỗi hex 64 ký tự (SHA-256)
  return /^[a-f0-9]{64}$/i.test(token);
}
