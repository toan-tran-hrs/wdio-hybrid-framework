import {
  toContain,
  notContain,
  toEqual,
  notEqual,
  toBeGreaterThan,
  toBeGreaterThanOrEqual,
  toBeLessThanOrEqual,
  toHaveText,
  toHaveTextContain,
  toBeExisting,
  notToBeExisting,
  toBeDisplayed,
  notToBeDisplayed,
  toBeLessThan,
  softAssert,
} from "./assertions.js";
import {
  addLog,
  click,
  tap,
  pressEnter,
  selectByAttribute,
  setText,
  getElementScreenshot,
  getElements,
} from "./commands.js";
import { selectDropdown, selectVisibleText, scrollElementIntoView } from "./browser/commands.js";
import { deleteDirectory, parseJsonFile, createDirectory } from "./file-utils.js";
import {
  getFormattedNumber,
  replaceCharacterAtIndex,
  addCharacterAtIndex,
  replaceAllForRecord,
} from "./string-helper.js";
import { csvParse, csvStringify } from "./csv-helper.js";
import {
  m$,
  swipe,
  checkActivityDisplayed,
  checkKeyboardDisplayed,
  checkElementFocused,
  touchByCoordinates,
  elementByText,
} from "./mobile/mobile-locator.js";
import {
  clearAppData,
  importAppData,
  getInstalledAppVersion,
  getMediaSessionInfo,
  setEmulatorGeoLocation,
  terminateApp,
} from "./mobile/commands.js";
import { cropImage } from "./image-process.js";
import { BrowserLogCollector } from "./browser/BrowserLogCollector.js";
import { splitFeaturesForParallelExecution } from "./feature-splitter.js";

export {
  deleteDirectory,
  createDirectory,
  parseJsonFile,
  getFormattedNumber,
  replaceCharacterAtIndex,
  addCharacterAtIndex,
  replaceAllForRecord,
  csvParse,
  csvStringify,
  splitFeaturesForParallelExecution,
};

export {
  addLog,
  click,
  tap,
  elementByText,
  selectByAttribute,
  getElements,
  scrollElementIntoView,
  pressEnter,
  selectDropdown,
  selectVisibleText,
  setText,
  toContain,
  notContain,
  toEqual,
  notEqual,
  toBeGreaterThan,
  toBeGreaterThanOrEqual,
  toBeLessThan,
  toBeLessThanOrEqual,
  toHaveText,
  toHaveTextContain,
  toBeExisting,
  notToBeExisting,
  toBeDisplayed,
  notToBeDisplayed,
  softAssert,
  m$,
  swipe,
  touchByCoordinates,
  cropImage,
  clearAppData,
  importAppData,
  checkActivityDisplayed,
  checkKeyboardDisplayed,
  checkElementFocused,
  getInstalledAppVersion,
  getMediaSessionInfo,
  setEmulatorGeoLocation,
  getElementScreenshot,
  terminateApp,
};

export { BrowserLogCollector };
