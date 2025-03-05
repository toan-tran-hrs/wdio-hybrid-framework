import { Given } from "@wdio/cucumber-framework";
import { appID } from "../../src/constants/AUT.js";
import DashboardPage from "../../src/pages/DashboardPage.js";

Given(/^the user opens the application$/, async function () {
  await driver.activateApp(appID);
});

Given(/^navigates to the Dashboard page$/, async function () {
  await DashboardPage.checkDisplayed();
});
