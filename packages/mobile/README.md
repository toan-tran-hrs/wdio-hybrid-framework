# Introduction

This package contains the automation test case for mobile application.

# Test Execution

The pre-defined `yarn android-app ui-regression` command is used to execute the test at local development.

The other commands used for formatting, and linting can be found at `package.json` under `scripts` section. Newly defined commands must also be added at the same place.

# Development environment setup

## Android

1. Install Java 8 or above ([OpenJDK 22](https://jdk.java.net/22/) is recomended).

2. Correctly setup the `JAVA_HOME` environment variable e.g. `C:\jdk-22`

3. Add `%JAVA_HOME%\bin\` to the `Path` environment variable.

4. Install the latest version of [Android Studio](https://developer.android.com/studio?_gl=1*1b7c62z*_up*MQ..&gclid=Cj0KCQjwwYSwBhDcARIsAOyL0fhJazVtRfmnEye-MTU-FL2ap0mTjR-5EJ_LYBLp78ZhfH9RWUPA53saAoTREALw_wcB&gclsrc=aw.ds)

5. Open Android Studio and navigate to `SDK Manager > Android SDK > SDK Tools`. Check and install the latest version of the following components:

- Android SDK Build-Tools
- Android SDK Command-line tools
- Android Emulator
- Android SDK Platform-tools
- Intel x86 Emulator Accelerator

6. Correctly setup the `ANDROID_HOME` environment variable e.g. `C:\Users\<your username>\AppData\Local\Android\Sdk`

7. Add `%ANDROID_HOME%\platform-tools\`, `%ANDROID_HOME%\emulator\`, and `%ANDROID_HOME%\cmdline-tools\latest\bin` to the `Path` environment variable

8. Open a terminal and run `sdkmanager --install "system-images;android-28;google_apis;x86_64"` to download the required emulator image for testing

9. Run `echo "no" | avdmanager --verbose create avd --force --name "Pixel_3_XL_API_28" --package "system-images;android-28;google_apis;x86_64" --tag "google_apis" --abi "x86_64" --device "pixel_3_xl"` to create a new emulator

10. Run `emulator -avd Pixel_3_XL_API_28 -writable-system` to start the created emulator
