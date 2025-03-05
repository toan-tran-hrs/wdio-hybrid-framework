import { setText, tap, toBeDisplayed, toEqual } from "utilities";

class MacroPage {
  private macroNameInput = $('//*[contains(@resource-id, "macroNameText")]');

  private addTriggerButton = $('//*[@content-desc="Add Trigger"]');
  private triggerListLocator = '//*[contains(@resource-id, "triggersList")]';
  private triggerEntryNameByOrder(order: number = 1) {
    return $(`(${this.triggerListLocator}//*[contains(@resource-id, "entry_name")])[${order}]`);
  }
  private triggerDetailByOrder(order: number = 1) {
    return $(`(${this.triggerListLocator}//*[contains(@resource-id, "entry_detail")])[${order}]`);
  }

  private addActionButton = $('//*[@content-desc="Add Action"]');
  private actionListLocator = '//*[contains(@resource-id, "actionsList")]';
  private actionEntryNameByOrder(order: number = 1) {
    return $(`(${this.actionListLocator}//*[contains(@resource-id, "entry_name")])[${order}]`);
  }
  private actionDetailByOrder(order: number = 1) {
    return $(`(${this.actionListLocator}//*[contains(@resource-id, "entry_detail")])[${order}]`);
  }

  private addConstraintButton = $('//*[@content-desc="Add constraint"]');
  private constraintListLocator = '//*[contains(@resource-id, "constraintsList")]';
  private constraintEntryNameByOrder(order: number = 1) {
    return $(`(${this.constraintListLocator}//*[contains(@resource-id, "entry_name")])[${order}]`);
  }

  private localVariableButton = $('//*[contains(@resource-id, "localVarsLabel")]');
  private addLocalVariableButton = $('//*[contains(@resource-id, "addVariableButton")]');
  private localVariableNameInputBox = $('//*[contains(@resource-id, "variable_new_variable_dialog_name")]');
  private variableTypeSpinner = $('//*[contains(@resource-id, "variable_new_variable_type_spinner")]');
  private variableTypeOptionByText = (option: string) => $(`//*[@text="${option}"]`);
  private get generalDialogOKButton() {
    return $('//*[contains(@resource-id, "okButton")]');
  }
  private localVariableListLocator = '//*[contains(@resource-id, "localVarsList")]';
  private getLocalVariableElement = (name: string, suffix: string = "") =>
    $(
      `${this.localVariableListLocator}//*[contains(@resource-id, "entry_name") and @text="${name}"]${suffix}`
    );

  private localVariableBlockByName = (name: string) => this.getLocalVariableElement(name);
  private localVariableValueByName = (name: string) =>
    this.getLocalVariableElement(name, "/following-sibling::*[contains(@resource-id, 'entry_detail')]");

  private variableValueInputBox = $('//*[contains(@resource-id, "enter_variable_dialog_value")]');

  public async checkDisplayed() {
    await toBeDisplayed(this.macroNameInput);
  }

  public async checkMacroNameInputBoxBlank() {
    const macroNameDefaultText = "Enter macro name";
    const macroNameActualText = await this.macroNameInput.getAttribute("text");
    await toEqual(macroNameActualText, macroNameDefaultText, undefined, true);
  }

  public async clickOnAddButtonByType(macroElement: MacroElementType | string) {
    const macroElementType =
      typeof macroElement === "string"
        ? MacroElementType[macroElement as keyof typeof MacroElementType]
        : macroElement;

    switch (macroElementType) {
      case MacroElementType.trigger:
        await tap(this.addTriggerButton);
        break;
      case MacroElementType.action:
        await tap(this.addActionButton);
        break;
      case MacroElementType.constraint:
        await tap(this.addConstraintButton);
        break;
    }
  }

  public async checkTriggerDisplayed(triggerType: string, option: string, order = 1) {
    const actualTriggerType = await this.triggerEntryNameByOrder(order).getText();
    const actualTriggerOption = await this.triggerDetailByOrder(order).getText();
    await toEqual(actualTriggerType, triggerType, undefined, true);
    await toEqual(actualTriggerOption, option, undefined, true);
  }

  public async checkActionDisplayed(action: string, option: string, order = 1) {
    const actualAction = await this.actionEntryNameByOrder(order).getText();
    const actualOption = await this.actionDetailByOrder(order).getText();
    await toEqual(actualAction, action, undefined, true);
    await toEqual(actualOption, option, undefined, true);
  }

  public async checkConstraintDisplayed(option: string, order = 1) {
    const actualOption = await this.constraintEntryNameByOrder(order).getText();
    await toEqual(actualOption, option, undefined, true);
  }

  public async createLocalVariable(localVariable: LocalVariable) {
    await tap(this.localVariableButton);
    await tap(this.addLocalVariableButton);
    await setText(this.localVariableNameInputBox, localVariable.name);
    await browser.pause(200);
    await tap(this.variableTypeSpinner);
    await tap(this.variableTypeOptionByText(localVariable.type));
    await tap(this.generalDialogOKButton);

    await tap(this.localVariableBlockByName(localVariable.name));
    if (localVariable.type === "Integer") {
      await setText(this.variableValueInputBox, localVariable.value);
    }
    await tap(this.generalDialogOKButton);
  }

  public async checkLocalVariableDisplayed(localVariable: LocalVariable) {
    const actualName = await this.localVariableBlockByName(localVariable.name).getText();
    const actualValue = await this.localVariableValueByName(localVariable.name).getText();
    await toEqual(actualName, localVariable.name, undefined, true);
    await toEqual(actualValue, localVariable.value, undefined, true);
  }
}

export enum MacroElementType {
  trigger,
  action,
  constraint,
}

export interface LocalVariable {
  name: string;
  type: string;
  value: string;
}

export default new MacroPage();
