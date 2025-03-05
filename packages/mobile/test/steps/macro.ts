import { DataTable, Then, When } from "@wdio/cucumber-framework";
import MacroPage from "../../src/pages/MacroPage.js";
import ActionPage from "../../src/pages/ActionPage.js";
import TriggerPage from "../../src/pages/TriggerPage.js";
import ConstraintPage from "../../src/pages/ConstraintPage.js";

When(/^the Macro page displays$/, async function () {
  await MacroPage.checkDisplayed();
});

Then(/^the Macro name input box on Macro page is blank$/, async function () {
  await MacroPage.checkMacroNameInputBoxBlank();
});

When(
  /^the user taps on add "(trigger|action|constraint)" element button on Macro page$/,
  async function (elementType: string) {
    await MacroPage.clickOnAddButtonByType(elementType);
  }
);

When(/^selects "(.+)" from the Action options$/, async function (option: string) {
  await ActionPage.tapElementByText(option);
});

When(/^taps "(.+)" button on Action page$/, async function (buttonName: string) {
  await ActionPage.tapElementByText(buttonName);
  this.action = buttonName;
});

When(/^selects the "(.+)" radio button on Action page and confirms dialog$/, async function (option: string) {
  await ActionPage.tapElementByText(option);
  await ActionPage.confirmOptionDialog();
  this.actionOption = option;
});

When(/^selects "(.+)" from the Trigger options$/, async function (category: string) {
  await TriggerPage.tapElementByText(category);
});

When(/^taps "(.+)" button on Trigger page$/, async function (buttonName: string) {
  await TriggerPage.tapElementByText(buttonName);
});

When(
  /^selects the "(.+)" radio button on Trigger page and confirms dialog$/,
  async function (option: string) {
    await TriggerPage.tapElementByText(option);
    await TriggerPage.confirmOptionDialog();
  }
);

When(/^chooses "(.+)" on Trigger page and confirms dialog$/, async function (option: string) {
  await TriggerPage.tapElementByText(option);
  await TriggerPage.confirmOptionDialog();
});

When(
  /^the first item in the trigger list displays "(.+)" as the type and "(.+)" as the selected option$/,
  async function (triggerType: string, option: string) {
    await MacroPage.checkTriggerDisplayed(triggerType, option);
  }
);

When(
  /^the first item in the action list displays "(.+)" as the type and "(.+)" as the selected option$/,
  async function (action: string, option: string) {
    await MacroPage.checkActionDisplayed(action, option);
  }
);

When(/^selects "(.+)" from the Constraint options$/, async function (option: string) {
  await ConstraintPage.tapElementByText(option);
});

When(/^taps "(.+)" button on Constraint page$/, async function (buttonName: string) {
  await ConstraintPage.tapElementByText(buttonName);
});

When(
  /^selects the "(.+)" radio button on Constraint page and confirms dialog$/,
  async function (option: string) {
    await ConstraintPage.tapElementByText(option);
    await ConstraintPage.confirmOptionDialog();
  }
);

When(
  /^the first item in the constraint list displays "(.+)" as the selected option$/,
  async function (option: string) {
    await MacroPage.checkConstraintDisplayed(option);
  }
);

When(/^the user adds a local variable with the following information$/, async function (data: DataTable) {
  const dataHash = data.hashes()[0];
  this.creatingLocalVariable = { name: dataHash.name, type: dataHash.type, value: dataHash.value };
  await MacroPage.createLocalVariable(this.creatingLocalVariable);
});

When(/^the first item in the variable list displays with the selected information$/, async function () {
  await MacroPage.checkLocalVariableDisplayed(this.creatingLocalVariable);
});
