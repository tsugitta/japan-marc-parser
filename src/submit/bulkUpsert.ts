import { readChunkSplittedByEmptyLine } from "../io/readChunkSplittedByEmptyLine";
import { parse } from "../parse/parse";
import { JapanMarkBook } from "../parse/types";

export const bulkUpsertBooks = async (_books: JapanMarkBook[]) => {
  /**
   * e.g. 何らかのストレージに保存する処理
   */
};

const BULK_SIZE = 5000;

export const bulkUpsertFile = async (filePath: string) => {
  let recordsToUpsert: JapanMarkBook[] = [];

  await readChunkSplittedByEmptyLine({
    filePath,
    onReadChunk: async ({ lines }) => {
      const parsed = parse(lines);

      recordsToUpsert.push(parsed);

      if (recordsToUpsert.length >= BULK_SIZE) {
        await bulkUpsertBooks(recordsToUpsert);

        recordsToUpsert = [];
      }
    },
  });

  if (recordsToUpsert.length > 0) {
    await bulkUpsertBooks(recordsToUpsert);
  }
};
