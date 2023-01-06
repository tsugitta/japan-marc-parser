import path from "path";

import { downloadZip } from "../../src/crawl/downloadZip";
import { extractFromZip } from "../../src/crawl/extractFromZip";
import { fetchJapanMarcBookOfferingsHtml } from "../../src/crawl/fetchJapanMarcBookOfferingsHtml";
import { parseJapanMarcBookOfferings } from "../../src/crawl/parseJapanMarcBookOfferings";
import { getTextFilePathsInDir } from "../../src/lib/getTextFilePathsInDir";
import { bulkUpsertFile } from "../../src/submit/bulkUpsert";

const main = async () => {
  const targetDate = process.env.TARGET_DATE;

  if (!targetDate?.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new Error("TARGET_DATE を 2022-01-01 のような形式で指定してください");
  }

  const offeringsHtml = await fetchJapanMarcBookOfferingsHtml();
  const offerings = parseJapanMarcBookOfferings(offeringsHtml);

  const offering = offerings.find((o) => o.type === "単行・逐次刊行資料" && o.uploadedAt === targetDate);

  if (!offering) {
    console.log(`TARGET_DATE=${targetDate} の提供はありませんでした。`);
    return;
  }

  console.log(`TARGET_DATE=${targetDate} の提供（${offering.recordCount}件）をダウンロードします。`);

  const { filePath: zipPath } = await downloadZip(offering.zipUrl.toString());
  const { directoryPath } = await extractFromZip(zipPath);
  const [offeringDataTextPath] = await getTextFilePathsInDir(directoryPath);

  await bulkUpsertFile(path.join(directoryPath, offeringDataTextPath));
};

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
