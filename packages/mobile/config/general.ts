import path from "node:path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(process.cwd(), "../../env/local-development.env") });
import { deleteDirectory, terminateApp } from "utilities";
import AzureDevopsReporter, { AzureReporterOptions } from "wdio-azure-devops-test-reporter";
import { CucumberOptions } from "@wdio/cucumber-framework/build/types.js";
import { ReporterClass } from "@wdio/types/build/Reporters.js";
import { ServiceEntry } from "@wdio/types/build/Services";
import { appID } from "../src/constants/AUT.js";

export const reportPath = path.join(
  process.cwd(),
  "reports",
  process.env.CHUNK_NUMBER ? `chunk_${process.env.CHUNK_NUMBER}` : ""
);

const azureReporterOptions: AzureReporterOptions = {
  outputDir: path.join(reportPath, "azure-reports"),
  azureConfigurationCapabilities: [
    {
      azureConfigId: "53",
      capabilities: {
        platformName: "Android",
        "appium:platformVersion": "9.0",
        "appium:deviceName": "Pixel 3 XL API 28",
        "appium:automationName": "UIAutomator2",
      },
    },
  ],
};

export const cucumberOptions: CucumberOptions = {
  require: ["./test/steps/**/*.ts"],
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
  timeout: 240000,
  retry: 1,
  retryTagFilter: "@Retry-Failure",
};

const services =
  process.env.START_APPIUM !== "false"
    ? [
        [
          "appium",
          {
            args: {
              allowInsecure: "adb_shell,emulator_console",
            },
            logPath: reportPath,
          },
        ],
      ]
    : [];

export const config: WebdriverIO.Config = {
  runner: "local",
  hostname: "127.0.0.1",
  path: "/",
  exclude: [],
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: "../tsconfig.json",
      files: true,
    },
  },
  capabilities: [],
  // ===================
  // Test Configurations
  // ===================
  // Level of logging verbosity: trace | debug | info | warn | error | silent
  logLevel: "error",
  onPrepare: () => {
    deleteDirectory(reportPath);
  },
  // If you only want to run your tests until a specific amount of tests have failed use
  // bail (default is 0 - don't bail, run all tests).
  bail: 0,
  waitforTimeout: 30000,
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
        showPreface: true,
      },
    ],
  ],
  // Cucumber Options
  cucumberOpts: cucumberOptions,

  // ===================
  // Test Configurations
  // ===================
  before: async () => {},
  afterStep: async (step, scenario, result) => {
    if (!result.passed) {
      await browser.takeScreenshot();
    }
  },
  afterScenario: async () => {
    await terminateApp(appID);
    // await clearAppData(appID);
    // await driver.activateApp(appID);
    // await driver.waitUntil(async () => {
    //   const currentActivity = await driver.getCurrentActivity();
    //   const isMainActivityLoaded = currentActivity.includes("com.hrs");
    //   return isMainActivityLoaded;
    // });
  },
  // ========
  // Services
  // ========
  services: services as ServiceEntry[],
};
