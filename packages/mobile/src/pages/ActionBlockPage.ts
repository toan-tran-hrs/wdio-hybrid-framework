import { elementByText, setText, tap, toBeDisplayed, toEqual } from "utilities";
import BasePage from "./BasePage.js";

class ActionBlockPage extends BasePage {
  private actionBarTitle = $('//*[contains(@resource-id, "toolbar")]//*[@text="Action Blocks"]');
  private addButton = $('//*[contains(@resource-id, "fab")]');
  private actionBlockNameInputBox = $('//*[contains(@resource-id, "actionBlockNameText")]');
  private actionBlockDescriptionInputBox = $('//*[contains(@text, "Enter Description")]');

  private addInputVariableButton = $('//*[contains(@resource-id, "addInputVariableButton")]');
  private addActionButton = $('//*[contains(@resource-id, "addActionButton")]');
  private addOutputVariableButton = $('//*[contains(@resource-id, "addOutputVariableButton")]');
  private get generalDialogOKButton() {
    return $('//*[contains(@resource-id, "okButton")]');
  }
  private get generalDialogCancelButton() {
    return $('//*[contains(@resource-id, "cancelButton")]');
  }
  private inputVariableToggle = $('//*[contains(@resource-id, "inputCollapseExpandButton")]');
  private outputVariableToggle = $('//*[contains(@resource-id, "outputCollapseExpandButton")]');

  private variableNameInputBox = $('//*[contains(@resource-id, "variable_new_variable_dialog_name")]');
  private variableTypeSpinner = $('//*[contains(@resource-id, "variable_new_variable_type_spinner")]');
  private variableTypeOptionByText = (option: string) => $(`//*[contains(@text, "${option}")]`);

  private getVariableElement = (name: string, category: "input" | "output", suffix: string = "") =>
    $(
      `${category === "input" ? '//*[contains(@resource-id, "inputVarsList")]' : '//*[contains(@resource-id, "outputVarsList")]'}//*[contains(@resource-id, "entry_name") and @text="${name}"]${suffix}`
    );

  private variableBlock = (name: string, category: "input" | "output") =>
    this.getVariableElement(name, category);
  private variableValue = (name: string, category: "input" | "output") =>
    this.getVariableElement(name, category, "/following-sibling::*[contains(@resource-id, 'entry_detail')]");

  private actionListLocator = '//*[contains(@resource-id, "actionsList")]';
  private actionEntryNameByOrder(order: number = 1) {
    return $(`(${this.actionListLocator}//*[contains(@resource-id, "entry_name")])[${order}]`);
  }
  private actionDetailByOrder(order: number = 1) {
    return $(`(${this.actionListLocator}//*[contains(@resource-id, "entry_detail")])[${order}]`);
  }

  private booleanVariableOptionByValue = (value: "True" | "False") =>
    $(`//*[contains(@resource-id, "booleanValueContainer")]//*[@text="${value}"]`);
  private stringVariableValueInputBox = $('//*[contains(@resource-id, "enter_variable_dialog_value")]');

  private actionBlockListLocator = '//*[contains(@resource-id, "actionBlocksList")]';
  private actionBlockByName(name: string, prefix = "") {
    return $(
      `${this.actionBlockListLocator}//*[contains(@resource-id, "name") and @text="${name}"]${prefix}`
    );
  }
  private actionDescriptionByName(name: string) {
    return this.actionBlockByName(name, "/following-sibling::*[contains(@resource-id, 'description')]");
  }

  private saveButton = $('//*[@content-desc="Accept"]');

  private validationErrorMessageByText = (errorText: string) =>
    $(`//*[contains(@resource-id, "message") and @text="${errorText}"]`);
  private validationErrorDialogCancelButton = elementByText("CANCEL");

  public async checkDisplayed() {
    await toBeDisplayed(this.actionBarTitle);
  }

  public async tapAddButton() {
    await tap(this.addButton);
  }

  public async clickOnAddButtonByType(actionBlockElement: ActionBlockElementType | string) {
    const actionBlockElementType =
      typeof actionBlockElement === "string"
        ? Object.entries(ActionBlockElementType).find((entry) => entry[1] === actionBlockElement)?.[1]
        : actionBlockElement;

    switch (actionBlockElementType) {
      case ActionBlockElementType.inputVariable:
        await tap(this.addInputVariableButton);
        break;
      case ActionBlockElementType.action:
        await tap(this.addActionButton);
        break;
      case ActionBlockElementType.outputVariable:
        await tap(this.addOutputVariableButton);
        break;
    }
  }

  public async enterActionBlockName(name?: string) {
    if (name) await setText(this.actionBlockNameInputBox, name);
  }

  public async enterActionBlockDescription(description?: string) {
    if (description) await setText(this.actionBlockDescriptionInputBox, description);
  }

  public async createVariable(variable: ActionBlockVariable, duplicated = false) {
    await setText(this.variableNameInputBox, variable.name);
    await browser.pause(200);
    await tap(this.variableTypeSpinner);
    await tap(this.variableTypeOptionByText(variable.type));
    await tap(this.generalDialogOKButton);

    if (!duplicated) {
      if (variable.category === "input") {
        await tap(this.inputVariableToggle);
      } else {
        await tap(this.outputVariableToggle);
      }

      await tap(this.variableBlock(variable.name, variable.category));
      if (variable.type === "Boolean") {
        await tap(
          this.booleanVariableOptionByValue(variable.value.toLowerCase() === "true" ? "True" : "False")
        );
      } else if (variable.type === "String") {
        await setText(this.stringVariableValueInputBox, variable.value);
      }
      await tap(this.generalDialogOKButton);
    }
  }

  public async checkActionDisplayed(action: string, option: string, order = 1) {
    const actualAction = await this.actionEntryNameByOrder(order).getText();
    const actualOption = await this.actionDetailByOrder(order).getText();
    await toEqual(actualAction, action, undefined, true);
    await toEqual(actualOption, option, undefined, true);
  }

  public async checkVariablesDisplayed(variables: ActionBlockVariable[]) {
    for (const variable of variables) {
      const actualVariableName = await this.variableBlock(variable.name, variable.category).getText();
      const actualVariableValue = await this.variableValue(variable.name, variable.category).getText();
      await toEqual(actualVariableName, variable.name, undefined, true);
      await toEqual(actualVariableValue.replace("Default: ", ""), variable.value, undefined, true);
    }
  }

  public async saveActionBlock() {
    await tap(this.saveButton);
  }

  public async checkActionBlockDisplayed(name: string, description: string) {
    await toBeDisplayed(this.actionBlockByName(name));
    const actualDescription = await this.actionDescriptionByName(name).getText();
    await toEqual(actualDescription, description, undefined, true);
  }

  public async checkValidationErrorDialogDisplayed(errorMessage: string) {
    await toBeDisplayed(this.validationErrorMessageByText(errorMessage), undefined, undefined, true);
  }

  public async cancelValidationErrorDialog() {
    await tap(this.validationErrorDialogCancelButton);
  }

  public async cancelCreationDialog() {
    await tap(this.generalDialogCancelButton);
  }
}

export interface ActionBlockVariable {
  name: string;
  type: string;
  value: string;
  category: "input" | "output";
}

export enum ActionBlockElementType {
  inputVariable = "input variable",
  action = "action",
  outputVariable = "output variable",
}

export default new ActionBlockPage();
