import { spawn, execSync } from "node:child_process";
import process from "node:process";
import path from "node:path";
import fs from "node:fs";

const chunks = [1, 2];

const reportPath = path.join(process.cwd(), "reports");
const allurePath = path.join(reportPath, "allure-results");
if (fs.existsSync(allurePath)) {
  fs.rmSync(allurePath, { recursive: true });
  fs.mkdirSync(allurePath);
}

async function healthcheckExecute() {
  try {
    execSync(`sdkmanager --install "system-images;android-28;google_apis;x86_64"`);
  } catch (error) {
    throw new Error("Error while installing android emulator image: " + error.message);
  }
  for (const chunk of chunks) {
    const testProcess = spawn(`yarn mobile test:android`, {
      shell: true,
      env: { ...process.env, CHUNK_NUMBER: chunk, TAG_EXPRESSION: `not @Pending and @Chunk-${chunk}` },
      cwd: path.join(process.cwd(), "../../"),
    });

    testProcess.stdout.on("data", (data) => {
      console.log(`[chunk ${chunk}] - stdout: ${data}`);
    });

    testProcess.stderr.on("data", (data) => {
      console.error(`[chunk ${chunk}] - stderr: ${data}`);
    });

    testProcess.on("close", (code) => {
      const chunkAllurePath = path.join(reportPath, `chunk_${chunk}`, "allure-results");
      fs.cpSync(chunkAllurePath, allurePath, { recursive: true });
      console.log(`Chunk ${chunk} exited with code ${code}`);
    });
  }
}

healthcheckExecute().then(() => {
  console.log("Test processes are created!!!");
});
