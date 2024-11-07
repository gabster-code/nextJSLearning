import { UAParser } from "ua-parser-js";

export function getDeviceInfo(userAgent: string) {
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  const os = parser.getOS();
  const browser = parser.getBrowser();

  // Better device type detection
  const deviceType =
    device.type || // First try the device's reported type
    (userAgent.toLowerCase().includes("iphone") ||
    userAgent.toLowerCase().includes("ipad") ||
    userAgent.toLowerCase().includes("android")
      ? "mobile" // Check for mobile devices
      : os.name?.toLowerCase().includes("ios") ||
        os.name?.toLowerCase().includes("android")
      ? "mobile" // Check OS
      : os.name?.toLowerCase().includes("windows") ||
        os.name?.toLowerCase().includes("mac")
      ? "desktop" // Check for desktop OS
      : "unknown");

  return {
    deviceType,
    deviceName:
      device.model ||
      (userAgent.toLowerCase().includes("iphone")
        ? "iPhone"
        : userAgent.toLowerCase().includes("ipad")
        ? "iPad"
        : "unknown"),
    os: `${os.name || "unknown"} ${os.version || ""}`.trim(),
    browser: `${browser.name || "unknown"} ${browser.version || ""}`.trim(),
  };
}

export function formatDeviceInfo(deviceInfo: ReturnType<typeof getDeviceInfo>) {
  const deviceTypeLabel =
    deviceInfo.deviceType === "desktop"
      ? "Desktop"
      : deviceInfo.deviceType === "mobile"
      ? "Mobile"
      : "";

  const deviceName =
    deviceInfo.deviceName !== "unknown" ? ` (${deviceInfo.deviceName})` : "";

  return `${deviceInfo.browser} on ${deviceInfo.os}${
    deviceTypeLabel ? ` (${deviceTypeLabel}${deviceName})` : ""
  }`;
}
