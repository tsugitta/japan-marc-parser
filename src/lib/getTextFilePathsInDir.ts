import fs from "fs/promises";

export const getTextFilePathsInDir = async (dir: string) => {
  const filePaths = await fs.readdir(dir);

  return filePaths.filter((filePath) => filePath.endsWith(".txt"));
};
