import fs from "node:fs";
import { addLog } from "../commands.js";

export const clearAppData = async (appID: string) => {
  addLog(`Clearing app data for ${appID}`);
  await driver.executeScript("mobile: shell", [
    {
      command: "pm",
      args: ["clear", appID],
    },
  ]);
};

export const importAppData = async (appID: string, dataPath: string) => {
  addLog(`Importing app data for ${appID} from ${dataPath}`);

  await driver.activateApp(appID);

  let appDataFolder: string;
  let ownerID: string;
  await browser.waitUntil(
    async () => {
      appDataFolder = await driver.executeScript("mobile: shell", [
        {
          command: "su",
          args: ["0", `ls -ld /data/data/${appID}`],
        },
      ]);
      ownerID = appDataFolder.split(/\s+/g)[3];
      return ownerID;
    },
    { timeout: 20000 }
  );

  await driver.pause(1000);
  await driver.pushFile("/data/local/tmp/profile.tar", fs.readFileSync(dataPath, { encoding: "base64" }));
  await driver.pause(1000);
  await driver.executeScript("mobile: shell", [
    {
      command: "su",
      args: ["0", `mv /data/local/tmp/profile.tar /data/data;`],
    },
  ]);
  await driver.pause(1000);
  await driver.executeScript("mobile: shell", [
    {
      command: "su",
      args: ["0", `tar -xvf /data/data/profile.tar -C /data/data/ --no-same-owner`],
    },
  ]);
  await driver.pause(1000);
  await driver.executeScript("mobile: shell", [
    {
      command: "su",
      args: ["0", `rm /data/data/profile.tar`],
    },
  ]);
  await driver.pause(1000);
  await driver.executeScript("mobile: shell", [
    {
      command: "su",
      args: ["0", `chown -R ${ownerID}:${ownerID} /data/data/${appID}`],
    },
  ]);

  await terminateApp(appID, 15000);
};

export const getInstalledAppVersion = async (appID: string) => {
  addLog(`Getting installed app version for ${appID}`);
  const versionInfo: string = await driver.executeScript("mobile: shell", [
    {
      command: "dumpsys",
      args: ["package", appID],
    },
  ]);

  const version = versionInfo
    .split("\n")
    .find((line) => line.includes("versionName="))
    ?.replace("versionName=", "")
    .trim();

  return version;
};

export const getMediaSessionInfo = async () => {
  const mediaSessionInfo: string = await driver.executeScript("mobile: shell", [
    {
      command: "dumpsys",
      args: ["media_session"],
    },
  ]);

  return mediaSessionInfo;
};

export const setEmulatorGeoLocation = async (location: { latitude: number; longtitude: number }) => {
  addLog(`Setting emulator geo location to ${location.latitude}, ${location.longtitude}`);
  await driver.executeScript("mobile: execEmuConsoleCommand", [
    {
      command: `geo fix ${location.longtitude} ${location.latitude}`,
    },
  ]);

  await driver.waitUntil(
    async () => {
      await driver.executeScript("mobile: refreshGpsCache", []);
      const currentLocation = await getEmulatorGeoLocation();
      console.log(`Device location: ${JSON.stringify(currentLocation)}`);
      return (
        Math.abs(currentLocation.latitude - location.latitude) <= 0.1 &&
        Math.abs(currentLocation.longtitude - location.longtitude) <= 0.1
      );
    },
    { timeout: 6000, interval: 1000, timeoutMsg: "Failed to set emulator geo location" }
  );
};

export const getEmulatorGeoLocation = async () => {
  addLog("Getting emulator geo location");
  let locationInfo: string;
  try {
    await driver.waitUntil(async () => {
      await driver.executeScript("mobile: refreshGpsCache", []);
      locationInfo = await driver.executeScript("mobile: shell", [
        {
          command: "dumpsys",
          args: ["location"],
        },
      ]);
      return locationInfo.match(/(\d)+\.(\d)+,(\d)+\.(\d)+/).length;
    });
  } catch (error) {
    console.log(error.message);
    return {
      latitude: null,
      longtitude: null,
    };
  }

  const rawLocation = locationInfo.match(/(\d)+\.(\d)+,(\d)+\.(\d)+/)[0];

  const location = {
    latitude: parseFloat(rawLocation.split(",")[0]),
    longtitude: parseFloat(rawLocation.split(",")[1]),
  };

  return location;
};

// This wrapper function is the same with the driver.terminateApp from wdio except it will return no timeout error
export const terminateApp = async (appId: string, timeout = 5000) => {
  await driver.executeScript("mobile: terminateApp", [
    driver.isAndroid
      ? {
          appId: appId,
          timeout: timeout,
        }
      : {
          bundleId: appId,
          timeout: timeout,
        },
  ]);
};
