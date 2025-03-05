import { tap } from "utilities";

export default abstract class BasePage {
  private get optionDialogOKButton() {
    return $('//*[@resource-id="android:id/button1"]');
  }
  public async tapElementByText(text: string) {
    await tap($(`//*[@text="${text}"]`));
  }
  public async confirmOptionDialog() {
    await tap(this.optionDialogOKButton);
  }
}
