import * as fs from "fs";
import * as readline from "readline";

export const readChunkSplittedByEmptyLine = async ({
  filePath,
  onReadChunk,
}: {
  filePath: string;
  onReadChunk: ({ index, lines }: { index: number; lines: string[] }) => Promise<void>;
}): Promise<void> => {
  const fileStream = fs.createReadStream(filePath, {
    encoding: "utf8",
    highWaterMark: 1024 * 1024,
  });

  const reader = readline.createInterface({ input: fileStream });

  let processedCount = 0;
  let lines: string[] = [];

  for await (const line of reader) {
    if (line === "") {
      await onReadChunk({
        index: processedCount,
        lines,
      });

      processedCount += 1;
      lines = [];
      continue;
    }

    lines.push(line);
  }
};
