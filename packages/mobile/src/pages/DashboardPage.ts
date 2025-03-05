import { elementByText, toBeDisplayed } from "utilities";
import BasePage from "./BasePage.js";

class DashboardPage extends BasePage {
  private addMacroButton = elementByText("Add Macro");

  public async checkDisplayed() {
    await toBeDisplayed(this.addMacroButton);
  }
}

export default new DashboardPage();
