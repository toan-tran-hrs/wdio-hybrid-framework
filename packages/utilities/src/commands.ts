import { ChainablePromiseArray, ChainablePromiseElement, Key } from "webdriverio";
import { cropImage } from "./image-process.js";

export const addLog = (log: string) => {
  console.log(`STEP: ${log}`);
};

export const setText = async (
  element: ChainablePromiseElement,
  text: string,
  physicalEmulatedClear = false,
  moveFocus = false
) => {
  try {
    if (browser.isMobile) {
      await element.waitForDisplayed({ timeout: 30000 }); // Increased timeout to 20 seconds
    } else {
      await element.waitForClickable({ timeout: 30000 }); // Increased timeout to 20 seconds
      if (physicalEmulatedClear) {
        await element.click();
        await browser.keys([Key.Ctrl, "a"]);
        await browser.pause(2000);
        await browser.keys(Key.Backspace);
      }
    }
    await element.setValue(text);
    addLog(`Entered value: ${text}`);

    if (!browser.isMobile && moveFocus) {
      await browser.execute(() => {
        (document.activeElement as HTMLElement).blur();
      });
    }
  } catch (error) {
    addLog(`Error in setText: ${error.message}`);
    throw error;
  }
};

export const selectByAttribute = async (
  elem: ChainablePromiseElement,
  attribute: string,
  value: string,
  timeout = 20000
) => {
  if (browser.isMobile) {
    await elem.waitForDisplayed({ timeout: timeout });
  } else {
    await elem.waitForClickable({ timeout: timeout });
  }
  await elem.selectByAttribute(attribute, value);
  addLog(`Select option with attribute ${attribute}=${value}: ${await elem.selector}`);
};

export const click = async (elem: ChainablePromiseElement, timeout = 20000) => {
  if (browser.isMobile) {
    await elem.waitForDisplayed({ timeout: timeout });
  } else {
    await elem.waitForClickable({ timeout: timeout });
  }
  await elem.click();
  addLog(`Clicked on element: ${await elem.selector}`);
};

export const tap = click;

export const pressEnter = async (elem: ChainablePromiseElement) => {
  await elem.waitForDisplayed();
  await elem.click();
  await browser.keys("Enter");
  addLog(`Press enter`);
};

export const getElementScreenshot = async (elem: ChainablePromiseElement) => {
  await elem.waitForDisplayed();
  let screenshot: string;
  if (browser.isMobile) {
    const fullScreenshot = await browser.takeScreenshot();
    const fullScreenshotBuffer = Buffer.from(fullScreenshot, "base64");

    const x = await elem.getLocation("x");
    const y = await elem.getLocation("y");
    const width = await elem.getSize("width");
    const height = await elem.getSize("height");

    const elementScreenshot = await cropImage(fullScreenshotBuffer, x, y, width, height);
    screenshot = elementScreenshot.toString("base64");
  } else {
    screenshot = await elem.takeScreenshot();
  }
  addLog(`Captured screenshot of element: ${await elem.selector}`);
  return screenshot;
};

// This function is used to get elements and wait until the elements are stable.
// This function should be used only when there's no other way to wait for the list of elements is stable
// and you want to interact with a member of the list such as 'getText' or 'click'.
export const getElements = async (selector: string): Promise<ChainablePromiseArray> => {
  let elements = await $$(selector);
  let compareCount = 2;
  await browser.waitUntil(
    async () => {
      if (JSON.stringify(elements) == JSON.stringify(await $$(selector))) {
        compareCount--;
      } else {
        elements = await $$(selector);
      }
      return compareCount === 0;
    },
    { timeout: 8000, interval: 1000 }
  );
  return elements;
};
