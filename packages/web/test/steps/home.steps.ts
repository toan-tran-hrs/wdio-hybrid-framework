import { Given, When, Then, After } from "@cucumber/cucumber";
import HomePage from "../../src/pages/HomePage.js";
import { softAssert, toEqual } from "utilities";

Given(/^I am on the home page$/, async function () {
  await HomePage.open();
});

When(/^I verify the title of the page is "(.*)"$/, async function (title: string) {
  const actualTitle = await browser.getTitle();
  await toEqual(actualTitle, title, undefined, true);
});

Then(/^I verify the google icon displays$/, async () => {
  await HomePage.checkIconDisplayed();
});

After("@Soft-Assertion-Check", async () => {
  softAssert.assertAll();
});
