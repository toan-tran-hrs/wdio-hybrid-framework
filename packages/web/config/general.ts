import path from "node:path";
import { deleteDirectory, softAssert } from "utilities";
import { WDIOBrowserName } from "../src/constants/capabilities.js";
import AzureDevopsReporter, { AzureReporterOptions } from "wdio-azure-devops-test-reporter";
import { CucumberOptions } from "@wdio/cucumber-framework/build/types.js";
import { WebDriverLogTypes } from "@wdio/types/build/Options.js";
import { WEB_URL } from "../src/constants/URL.js";
import { ReporterClass } from "@wdio/types/build/Reporters.js";

const azureReporterOptions: AzureReporterOptions = {
  azureConfigurationCapabilities: [
    {
      azureConfigId: "52",
      capabilities: { browserName: WDIOBrowserName.CHROME },
    },
  ],
};

const isWindows = process.platform === "win32";
const reportPath = path.join(process.cwd(), "reports" + `${process.env.ENVIRONMENT ?? ""}`);

const requiredStepsPattern = ["./test/steps/**/*.ts"];
const executingSpecsPattern = ["../test/features/**/*.feature"];

export const cucumberOptions: CucumberOptions = {
  require: requiredStepsPattern,
  backtrace: false,
  requireModule: [],
  failAmbiguousDefinitions: true,
  failFast: false,
  ignoreUndefinedDefinitions: false,
  scenarioLevelReporter: false,
  order: "defined",
  strict: true,
  tags: process.env.TAG_EXPRESSION ?? "not @Pending",
  tagsInTitle: false,
  timeout: 600000,
  retry: 2,
  retryTagFilter: "@Retry-Failure",
};

export const config: WebdriverIO.Config = {
  runner: "local",
  specs: executingSpecsPattern,
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "../tsconfig.json",
      files: true,
    },
  },
  // ============
  // Capabilities
  // ============
  maxInstances: 4,
  capabilities: [
    {
      maxInstances: 4,
      browserName: WDIOBrowserName.CHROME,
      "goog:chromeOptions": !isWindows
        ? {
            args: [
              "--window-size=1920,1080",
              "--no-sandbox",
              "--disable-dev-shm-usage",
              "--disable-gpu",
              "--headless",
            ],
          }
        : undefined,
      acceptInsecureCerts: true,
    },
  ],
  // ========
  // Services
  // ========
  services: [],
  // ===================
  // Test Configurations
  // ===================
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: (process.env["LOGLEVEL"] as WebDriverLogTypes) ?? "warn",
  onPrepare: () => {
    deleteDirectory(reportPath);
  },
  beforeStep: async function (step) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    softAssert.setCurrentStep((step as any).keyword + step.text);
  },
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  baseUrl: WEB_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  // ===========
  // Test runner
  // ===========
  framework: "cucumber",
  reporters: [
    "spec",
    [
      AzureDevopsReporter as unknown as ReporterClass,
      azureReporterOptions as unknown as WebdriverIO.ReporterOption,
    ],
    [
      "allure",
      {
        outputDir: path.join(reportPath, "allure-results"),
        disableWebdriverStepsReporting: true,
        useCucumberStepReporter: true,
      },
    ],
  ],
  // Cucumber Options
  cucumberOpts: cucumberOptions,
};
