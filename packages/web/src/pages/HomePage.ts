import { toBeDisplayed } from "utilities";

class HomePage {
  private googleIcon = $('img[alt="Google"]');

  public async open() {
    await browser.url("");
  }
  public async checkIconDisplayed() {
    await toBeDisplayed(this.googleIcon);
  }
}

export default new HomePage();
