/* eslint-disable @typescript-eslint/ban-ts-comment */
import { load, save } from "gherking";
import fs from "node:fs";
import path from "node:path";

export async function splitFeaturesForParallelExecution(featureFolderPath: string, maxExampleLength = 25) {
  const features = fs
    .readdirSync(featureFolderPath)
    .filter((file) => file.endsWith(".feature"))
    .map((file) => `${path.join(featureFolderPath, file)}`);
  console.log("Processing the features:");
  console.log(JSON.stringify(features, undefined, 2));
  for (const feature of features) {
    await splitFeature(feature, maxExampleLength);
  }
}

async function splitFeature(featurePath: string, maxExampleLength: number) {
  const ast = await load(featurePath);
  const shouldSplit =
    ast[0].feature.elements.length > 1 ||
    ast[0].feature.elements.some(
      (element) =>
        // @ts-ignore
        element.examples?.length > 1 || // @ts-ignore
        element.examples?.some((example) => example.body && example.body.length > maxExampleLength)
    );

  if (shouldSplit) {
    const clonedAST = await load(featurePath);
    fs.renameSync(featurePath, featurePath.replace(".feature", ".original"));

    let index = 1;
    for (const scenario of ast[0].feature.elements) {
      clonedAST[0].feature.elements = [scenario];
      // @ts-ignore
      if (!scenario.examples || scenario.examples.length === 0) {
        await save(getSplitedFeaturePath(featurePath, index++), clonedAST, {
          lineBreak: "\n",
        });
        continue;
      }

      // @ts-ignore
      for (const example of scenario.examples) {
        const exampleChunks = splitArrayIntoChunks(example.body, maxExampleLength);
        for (const chunk of exampleChunks) {
          example.body = chunk;
          // @ts-ignore
          clonedAST[0].feature.elements[0].examples = [example];
          await save(getSplitedFeaturePath(featurePath, index++), clonedAST, {
            lineBreak: "\n",
          });
        }
      }
    }
    return;
  }
  console.log(`No need to split the feature file ${featurePath}`);
}

function getSplitedFeaturePath(featurePath: string, index: number) {
  return path.join(
    path.dirname(featurePath),
    path.basename(featurePath).replace(path.extname(featurePath), `.chunk${index}`) +
      path.extname(featurePath)
  );
}

function splitArrayIntoChunks(array: unknown[], chunkSize: number) {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}
