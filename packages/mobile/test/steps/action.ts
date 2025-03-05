import { DataTable, Then, When } from "@wdio/cucumber-framework";
import ActionBlockPage, { ActionBlockVariable } from "../../src/pages/ActionBlockPage.js";

When(/^the Action Block page displays$/, async function () {
  await ActionBlockPage.checkDisplayed();
});

When(/^user tap \+ button on Action Block page$/, async function () {
  await ActionBlockPage.tapAddButton();
});

When(
  /^the user taps on add "(input variable|action|output variable)" element button on Action Block page$/,
  async function (elementType: string) {
    await ActionBlockPage.clickOnAddButtonByType(elementType);
  }
);

When(
  /^the user enters "(.*)" as name and "(.*)" as description of the action block$/,
  async function (name: string, description: string) {
    await ActionBlockPage.enterActionBlockName(name);
    await ActionBlockPage.enterActionBlockDescription(description);
    this.name = name;
    this.description = description;
  }
);

When(
  /^the user add a new (input|output) variable with the following details on Action Block page$/,
  async function (category: string, data: DataTable) {
    const dataHash = data.hashes()[0];
    const variable = {
      name: dataHash.name,
      type: dataHash.type,
      value: dataHash.value,
      category: category,
    };
    await ActionBlockPage.createVariable(variable as ActionBlockVariable, dataHash.duplicated === "true");
    if (!this.createdVariables) {
      // Init array to save created variables
      this.createdVariables = [];
    }
    this.createdVariables.push(variable);
  }
);

Then(/^the action block detail should display the entered information$/, async function () {
  await ActionBlockPage.checkVariablesDisplayed(this.createdVariables);
  await ActionBlockPage.checkActionDisplayed(this.action, this.actionOption);
});

Then(/^the action block variable should display with the entered information$/, async function () {
  await ActionBlockPage.checkVariablesDisplayed(this.createdVariables);
});

When(/^the user taps on the V button to save the action block$/, async function () {
  await ActionBlockPage.saveActionBlock();
});

When(
  /^the newly added action block should be displayed with the correct name and description$/,
  async function () {
    await ActionBlockPage.checkActionBlockDisplayed(this.name, this.description);
  }
);

When(
  /^the action block validation error display with the message "(.+)"$/,
  async function (errorMessage: string) {
    await ActionBlockPage.checkValidationErrorDialogDisplayed(errorMessage);
  }
);

When(
  /^the variable validation error display with the message "(.+)"$/,
  async function (errorMessage: string) {
    await ActionBlockPage.checkValidationErrorDialogDisplayed(errorMessage);
  }
);

When(/^the user cancels the action block validation error dialog$/, async function () {
  await ActionBlockPage.cancelValidationErrorDialog();
});

When(/^the user cancels the variable validation error dialog$/, async function () {
  await ActionBlockPage.confirmOptionDialog();
});

When(/^the user cancels the variable creation dialog$/, async function () {
  await ActionBlockPage.cancelCreationDialog();
});
