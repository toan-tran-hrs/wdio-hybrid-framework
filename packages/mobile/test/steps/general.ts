import { After, When } from "@wdio/cucumber-framework";
import DashboardPage from "../../src/pages/DashboardPage.js";
import { softAssert } from "utilities";

When(/^the user taps on "(.+)" button$/, async function (buttonName: string) {
  await DashboardPage.tapElementByText(buttonName);
});

After("@Soft-Assertion-Check", async () => {
  softAssert.assertAll();
});
