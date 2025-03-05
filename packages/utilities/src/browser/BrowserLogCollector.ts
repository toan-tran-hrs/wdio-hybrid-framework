export class BrowserLogCollector {
  private logs: string[] = [];
  private pageName;

  public async enableBrowserLog() {
    const puppeteer = await browser.getPuppeteer();
    const log = async function () {
      const pages = await puppeteer.pages();
      pages[0].on("console", (msg) => this.logs.push(`${this.pageName} LOG: ${msg.text()}`));
      pages[0].on("pageerror", (error) => this.logs.push(`${this.pageName} ERROR: ${error.message}`));
    }.bind(this);
    await browser.call(log);
  }

  public setPageName(name: string) {
    this.pageName = name;
  }

  public getLogs() {
    return this.logs.join("\n");
  }
}
