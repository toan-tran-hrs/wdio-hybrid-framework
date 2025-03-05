import fs from "node:fs";

export const parseJsonFile = (datapath: string) => {
  const data = fs.readFileSync(datapath, "utf-8");
  return JSON.parse(data);
};

export const deleteDirectory = (path: string) => {
  if (fs.existsSync(path)) {
    fs.rmSync(path, { recursive: true });
    console.log(`Directory Deleted: ${path}`);
  }
};

export const createDirectory = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
    console.log(`Directory Created: ${path}`);
  }
};
