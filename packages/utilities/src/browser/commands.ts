import { ChainablePromiseArray, ChainablePromiseElement } from "webdriverio";
import { addLog } from "../commands.js";

export const selectDropdown = async (elements: ChainablePromiseArray, value: string) => {
  for (let i = 0; i < (await elements.length); i++) {
    await elements[i].waitForDisplayed();
    const elem = await elements[i].getAttribute("value");
    if (elem === value) {
      await elements[i].click();
      addLog(`Selected dropdown value: ${value}`);
      break;
    }
  }
};

export const scrollElementIntoView = async (elem: ChainablePromiseElement) => {
  await elem.waitForDisplayed();
  await elem.scrollIntoView();
};

export const selectVisibleText = async (elem: ChainablePromiseElement, text: string) => {
  await elem.waitForDisplayed();
  await elem.selectByVisibleText(text);
  addLog(`Selected by visible text: ${text}`);
};
