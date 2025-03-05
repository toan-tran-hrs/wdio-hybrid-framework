# Introduction

The automation framework is built based on [WebdriverIO](https://webdriver.io/docs/configuration) framework which supports APIs, browser, and mobile application testing. TypeScript is the language used for scripting.

This can be used as a boilerplate for automation testing implementation.

# Getting Started

1.  Requirement:

    NodeJS must be installed before any execution. The `LTS version` (v22.x.x) is used for development currently. NodeJS is a cross-platform JavaScript Runtime Environment, the automation test can be executed on a Windows, Linux, or macOS machine as well as a container environment.

    We're using `yarn` as the package manager. Install it using the command `npm install -g yarn` is recomended after installing Nodejs.

2.  Dependencies:

    After cloning this project’s source to a machine, it’s a must to run `yarn` command to install all required dependencies for development or execution.

    This framework is built on top of WebdriverIO, so its core dependencies come from WebdriverIO projects such as the Cucumber plugin, test runner, reporter, and test runtime services. Besides that, some minor modules are used for various functions. The full list can be found in sub-projects' `package.json` files under the `devDependencies` section.

3.  Framework structure

    This repository includes multiple sub-projects for different purposes. 
    The `utilities` packages are the common libraries that can be reused on different testing packages.

    The structure documentation can be found [here](./folder-structure.md).

# Predefined commands for sub-projects' workspaces:

The `scripts` section in the `package.json` file on the root directory defines shortcuts to execute defined scripts on sub-projects.

# Pull Request Policies

All of the changes to the source must be done through a pull request so it can be reviewed by other team members.

A new PR can be merged into `main` branch when:

1. The code or documentation changes are reviewed and approved by at least one team member excluding the PR owner

2. The PR must be linked with 1 work item

3. The PR verification build must be successful. If the verification build has failed due to any acceptable reasons such as AUT bugs or environmental issues and the PR can be merged then, related comments must be added to the PR.

# Dependencies upgrade

Defined versions of using dependencies can be found inside `package.json` and their exact installed versions can be found inside `yarn.lock`.

To upgrade dependencies' version, run the command `yarn upgrade-interactive` and follow the instruction of the tool to select desired versions.

After the version information in `package.json` is updated and the new packages are verified with no negative impact on the current framework, the `yarn.lock` file must be committed in the PR for dependencies upgrade.
