import { ChainablePromiseElement } from "webdriverio";
import { driver, $ } from "@wdio/globals";
import { toContain, toEqual, notContain } from "../assertions.js";
import { addLog } from "../commands.js";

export function m$(locator: {
  android?: string;
  ios?: string;
  iosPredicateString?: string;
  iosClassChain?: string;
}): ChainablePromiseElement {
  let elementLocator: string;
  if (driver.isAndroid) {
    elementLocator = locator.android;
  } else {
    if (locator.iosPredicateString) {
      elementLocator = `-ios predicate string:${locator.iosPredicateString}`;
    } else if (locator.iosClassChain) {
      elementLocator = `-ios class chain:${locator.iosClassChain}`;
    } else {
      elementLocator = locator.ios;
    }
  }
  return elementLocator ? $(elementLocator) : undefined;
}

export async function swipe(startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) {
  await driver
    .action("pointer")
    .move({ x: startPoint.x, y: startPoint.y })
    .down()
    .pause(200)
    .move({ duration: 700, x: endPoint.x, y: endPoint.y })
    .up()
    .perform();

  // Wait 1s for the swipe to complete based on the recomendation from webdriverio boilerplate
  await driver.pause(1000);
}

export async function touchByCoordinates(x: number, y: number) {
  await driver.action("pointer").move({ x: x, y: y }).down().pause(200).up().perform();
}
export const checkActivityDisplayed = async (
  activityName: string,
  option = { timeout: 5000, reverse: false }
) => {
  try {
    await driver.waitUntil(
      async () => {
        const isCurrentActivityIncluded = (await driver.getCurrentActivity()).includes(activityName);
        return option.reverse ? !isCurrentActivityIncluded : isCurrentActivityIncluded;
      },
      {
        timeout: option.timeout,
      }
    );
  } catch (error) {
    console.log("Current activity: ", await driver.getCurrentActivity());
    console.error(
      `Activity ${activityName} is ${option.reverse ? "still" : "not"} displayed after ${option.timeout}ms`
    );
    console.error(error.message);
  }
  const currentActivity = await driver.getCurrentActivity();
  if (option.reverse) {
    notContain(currentActivity, activityName);
  } else {
    toContain(currentActivity, activityName);
  }
};

export const checkKeyboardDisplayed = async (option = { timeout: 5000, reverse: false }) => {
  addLog(`Checking if keyboard is ${option.reverse ? "not" : ""} displayed`);
  try {
    await driver.waitUntil(async () => (await driver.isKeyboardShown()) === (option.reverse ? false : true), {
      timeout: option.timeout,
    });
  } catch (error) {
    console.error(`Keyboard is ${option.reverse ? "still" : "not"} showing after ${option.timeout}ms`);
    console.error(error.message);
  }

  const isKeyboardDisplayed = await driver.isKeyboardShown();
  toEqual(isKeyboardDisplayed, option.reverse ? false : true);
};

export const checkElementFocused = async (
  element: ChainablePromiseElement,
  option = { timeout: 5000, reverse: false }
) => {
  addLog(`Checking if element ${await element.selector} is ${option.reverse ? "not" : ""} focused`);
  try {
    await driver.waitUntil(
      async () => (await element.getAttribute("focused")) === (option.reverse ? "false" : "true"),
      { timeout: option.timeout }
    );
  } catch (error) {
    console.error(
      `Element ${await element.selector} is ${option.reverse ? "still" : "not"} focused after ${option.timeout}ms`
    );
    console.error(error.message);
  }
  const focused = await element.getAttribute("focused");
  toEqual(focused, option.reverse ? "false" : "true");
};

export const elementByText = (text: string) => $(`//*[@text="${text}"]`);
