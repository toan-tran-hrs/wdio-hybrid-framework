# General structure of the automation framework

The current framework structure is independent of using automation tools or libraries. It's designed as a hybrid automation framework, meaning every approach can be applied. Currently, modular-based and BDD approaches are used.

## Modular-based structure

Require breaking down the application into individual modules, services, functions, and sections that can be tested in isolation. Test scripts are created for each part and then hierarchically separated into folders.

## BDD approach

Gherkin is currently used for writing testing scenarios. It is designed to be easy to learn by non-programmers

## Folders and files on each package

### /src

This is the place for QA automation engineers. It contains multiple sub-folders storing abstract layers of the core functions for test scenarios scripting. Data models, API call wrappers, page object classes, utilities, and constants classes are grouped in separate folders. The number of sub-folders can be increased in the development time.

## /test

Gherkin's test scenarios are stored in the **features** sub-folder following the modular-based structure. Each feature file contains the testing scenarios for a single module, API, or function. In more complicated modules when the number of scenarios is big enough, a folder containing multiple feature files for that module should be created.

The **steps** directory is the place for storing the definition of how the test scenarios are executed.

The data used at the execution time are stored under the **resources** directory such as the JSON data, uploading files used for the test cases, and expectation images.

## /config

The test runner configuration or profile files for each of the testing platforms and environments will be saved here. Those files should follow config as code approach so some common configure such as testing services, and suite configurations can be reused to prevent duplication.

## /.pipelines

Storing the infrastructure of automation testing pipelines.

## /.logs and /.reports

The execution time log file and result report in different formats are saved here for local development and debugging on the CI system. The report can also be used to import into a project management system like Azure DevOps or Jira or other reporting dashboards.

## /env

Only supports local development by storing the blueprint of required secret variables for test execution such as authenticated information.

## /.vscode (or other IDE's specific configuration folder)

Storing the IDE configuration of the current project. It allows sharing the complicated IDE configuration to the development team including non-programmers such as debugging and test executing commands.

## Project descriptor file package.json

It contains information about the project, configuration, and dependencies details.

## README

Briefly describe the goal of the project with some introduction for the newcomers.

## Other files

Mainly contain project configuration files relating to git, linting, and formatting tools.
