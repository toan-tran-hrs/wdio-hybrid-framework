import { ChainablePromiseElement } from "webdriverio";
import { addLog } from "./commands.js";
import assert from "node:assert";

class SoftAssertCollector {
  private errors: Error[] = [];
  private currentStep: string = "";

  async collect(error: Error) {
    this.errors.push(new Error(`[${this.currentStep}] ${error.message}`));
  }

  async setCurrentStep(step: string) {
    this.currentStep = step;
  }

  assertAll(): void {
    if (this.errors.length > 0) {
      const errorMessage = this.errors.map((e) => e.message).join("\n");
      this.clear();
      throw new Error(`Soft Assertions Failed:\n${errorMessage}`);
    }
  }

  clear(): void {
    this.errors = [];
  }

  hasFailures(): boolean {
    return this.errors.length > 0;
  }
}

export const softAssert = new SoftAssertCollector();

export async function toContain(
  actual: string | string[] | unknown[],
  expected: string | unknown,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to contain ${expected}`;

  try {
    expect(actual).toContain(expected);
    addLog(`Assertion Passed >> ${actual} contains ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function notContain(
  actual: string | string[],
  expected: string,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} not to contain ${expected}`;

  try {
    expect(actual).not.toContain(expected);
    addLog(`Assertion Passed >> ${actual} does not contain ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toEqual(
  actual: unknown,
  expected: unknown,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to equal ${expected}`;

  try {
    assert.deepStrictEqual(actual, expected, message);
    addLog(`Assertion Passed >> ${actual} to equal ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function notEqual(
  actual: unknown,
  expected: unknown,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} not to equal ${expected}`;

  try {
    expect(actual).not.toEqual(expected);
    addLog(`Assertion Passed >> ${actual} not equal ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeLessThan(
  actual: number,
  expected: number,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to be less than ${expected}`;

  try {
    expect(actual).toBeLessThan(expected);
    addLog(`Assertion Passed >> ${actual} to be less than ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeLessThanOrEqual(
  actual: number,
  expected: number,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to be less than or equal to ${expected}`;

  try {
    expect(actual).toBeLessThanOrEqual(expected);
    addLog(`Assertion Passed >> ${actual} to be less than or equal to ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeGreaterThan(
  actual: number,
  expected: number,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to be greater than ${expected}`;

  try {
    expect(actual).toBeGreaterThan(expected);
    addLog(`Assertion Passed >> ${actual} to be greater than ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeGreaterThanOrEqual(
  actual: number,
  expected: number,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${actual} to be greater than or equal to ${expected}`;

  try {
    expect(actual).toBeGreaterThanOrEqual(expected);
    addLog(`Assertion Passed >> ${actual} to be greater than or equal to ${expected}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toHaveText(
  element: ChainablePromiseElement,
  expectedText: string,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} to have text ${expectedText}`;

  try {
    await expect(element).toHaveText(expectedText);
    addLog(`Assertion Passed >> ${await element.selector} has text ${expectedText}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toHaveTextContain(
  element: ChainablePromiseElement,
  expectedText: string,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} to have text containing ${expectedText}`;

  try {
    await expect(element).toHaveText(expectedText, { containing: true });
    addLog(`Assertion Passed >> ${await element.selector} has text containing ${expectedText}`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeExisting(
  element: ChainablePromiseElement,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} to exist`;

  try {
    await expect(element).toBeExisting();
    addLog(`Assertion Passed >> ${await element.selector} exists`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function notToBeExisting(
  element: ChainablePromiseElement,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} not to exist`;

  try {
    await expect(element).not.toBeExisting();
    addLog(`Assertion Passed >> ${await element.selector} does not exist`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function toBeDisplayed(
  element: ChainablePromiseElement,
  timeout = 5000,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} to be displayed`;

  try {
    await expect(element).toBeDisplayed({ wait: timeout });
    addLog(`Assertion Passed >> ${await element.selector} is displayed`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}

export async function notToBeDisplayed(
  element: ChainablePromiseElement,
  message?: string,
  soft = false,
  takeFailScreenShot = true
) {
  message = message ?? `Expected ${await element.selector} not to be displayed`;

  try {
    await expect(element).not.toBeDisplayed();
    addLog(`Assertion Passed >> ${await element.selector} is not displayed`);
  } catch (error) {
    addLog(`Assertion Failed >> ${message}`);
    if (takeFailScreenShot) await browser.takeScreenshot();

    if (soft) {
      await softAssert.collect(error as Error);
    } else {
      throw error;
    }
  }
}
