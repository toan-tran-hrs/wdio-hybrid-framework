import { splitFeaturesForParallelExecution } from "utilities";
import path from "node:path";
import process from "node:process";

splitFeaturesForParallelExecution(path.join(process.cwd(), "test/features"));
