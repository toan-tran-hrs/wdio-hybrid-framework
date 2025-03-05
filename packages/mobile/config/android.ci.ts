import { config as generalConfig, reportPath } from "./general.js";
import path from "node:path";
import { deleteDirectory, terminateApp } from "utilities";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { appID } from "../src/constants/AUT.js";

const chunkNumber = process.env.CHUNK_NUMBER ? Number(process.env.CHUNK_NUMBER) : 0;

const appiumServerPort = 4723 + chunkNumber;
const emulatorPort = 5554 + 2 * chunkNumber;
const avdName = `Pixel_3_XL_API_28${chunkNumber ? `_${chunkNumber}` : ""}`;
const avdFolderPath = path.join(process.cwd(), "../../", chunkNumber ? `avd_${chunkNumber}` : "avd");

export const config: WebdriverIO.Config = {
  ...generalConfig,
  specs: ["../test/features/healthcheck/*.feature"],
  port: appiumServerPort,
  // ============
  // Capabilities
  // ============
  maxInstances: 1,
  capabilities: [
    {
      platformName: "Android",
      "appium:udid": `emulator-${emulatorPort}`,
      "appium:avd": avdName,
      "appium:avdLaunchTimeout": 240000,
      "appium:avdReadyTimeout": 240000,
      "appium:gpsEnabled": true,
      "appium:avdArgs": `-no-snapshot -no-boot-anim -writable-system -port ${emulatorPort}`,
      "appium:platformVersion": "9.0",
      "appium:automationName": "UIAutomator2",
      "appium:newCommandTimeout": 240,
      "appium:app": path.join(process.cwd(), "aut/hrs_and_china_3.9.0-build-local-release-signed.apk"),
      "appium:appWaitActivity": "com.hrs.*",
      "appium:appWaitDuration": 240000,
      "appium:androidInstallTimeout": 240000,
      "appium:fullReset": true,
    },
  ],
  // ========
  // Services
  // ========
  services: [
    [
      "appium",
      {
        logPath: reportPath,
        args: {
          allowInsecure: "adb_shell,emulator_console",
          port: appiumServerPort,
        },
      },
    ],
  ],
  // ===================
  // Test Configurations
  // ===================
  onPrepare: async () => {
    deleteDirectory(reportPath);
    execSync(
      `echo "no" | avdmanager --verbose create avd --force --name "${avdName}" --package "system-images;android-28;google_apis;x86_64" --tag "google_apis" --abi "x86_64" --device "pixel_3_xl" --path ${avdFolderPath}`
    );

    const avdConfigFile = path.join(avdFolderPath, "config.ini");
    const initConfig = fs.readFileSync(avdConfigFile, "utf8").toString();
    const systemImageConfig = initConfig.split("\n").find((line) => line.includes("image.sysdir"));
    fs.copyFileSync(path.join(process.cwd(), "pixel_3a_xl_api_28.ini"), avdConfigFile);
    fs.appendFileSync(avdConfigFile, systemImageConfig);
  },
  onComplete: async () => {
    execSync(`adb -s emulator-${emulatorPort} emu kill`);
    execSync(`avdmanager delete avd -n ${avdName}`);
  },
  before: async () => {},
  // afterFeature: async (uri, feature) => {
  // },
  afterStep: async (step, scenario, result) => {
    if (!result.passed) {
      await driver.takeScreenshot();

      await terminateApp(appID);
      await driver.activateApp(appID);
      await driver.waitUntil(async () => {
        const isMainActivityLoaded = (await driver.getCurrentActivity()).includes("home.SideMenuActivity");
        return isMainActivityLoaded;
      });
    }
  },
};
