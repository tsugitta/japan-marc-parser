import fs from "fs/promises";

import fetch from "node-fetch";

import { urlToFileName } from "./fileName";

const fileExists = async (path: string) => {
  try {
    return !!(await fs.lstat(path));
  } catch (e) {
    return false;
  }
};

export const downloadZip = async (
  url: string,
): Promise<{
  filePath: string;
}> => {
  const fileName = urlToFileName(url);

  await fs.mkdir(`${__dirname}/downloaded`, { recursive: true });

  const filePath = `${__dirname}/downloaded/${fileName}`;

  if (await fileExists(filePath)) {
    console.log(`既にダウンロードされているため取得をスキップします。 ${url}`);

    return { filePath };
  }

  const response = await fetch(url);
  const buffer = await response.buffer();

  await fs.writeFile(filePath, buffer);

  console.log(`ダウンロードが完了しました。 ${url}`);

  return { filePath };
};
