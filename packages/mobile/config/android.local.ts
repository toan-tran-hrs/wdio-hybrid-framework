import path from "node:path";
import { config as generalConfig } from "./general.js";

export const uiautomatorPort = 8201;
const appiumServerPort = 4723;
export const avdName = "Pixel_3_XL_API_28";
const platformVersion = "9.0";

export const config: WebdriverIO.Config = {
  ...generalConfig,
  specs: ["../test/features/**/*.feature"],
  port: appiumServerPort,
  // ============
  // Capabilities
  // ============
  maxInstances: 1,
  capabilities: [
    {
      platformName: "Android",
      "appium:avd": avdName,
      "appium:avdLaunchTimeout": 240000,
      "appium:avdReadyTimeout": 240000,
      "appium:gpsEnabled": true,
      "appium:platformVersion": platformVersion,
      "appium:automationName": "UIAutomator2",
      "appium:newCommandTimeout": 480,
      "appium:app": path.join(process.cwd(), "aut/MacroDroid.apk"),
      "appium:appWaitActivity": "com.arlosoft.macrodroid.homescreen.NewHomeScreenActivity",
      "appium:systemPort": uiautomatorPort,
      "appium:fullReset": false,
      "appium:noReset": true,
    },
  ],
};
