import { JSDOM } from "jsdom";
import { sortBy } from "lodash";

import { DateString, extractDateString } from "../lib/dateString";
import { isNotNullish } from "../lib/isNotNullish";
import { rootUrl } from "./fetchJapanMarcBookOfferingsHtml";

const parseTr = (tr: Element) => {
  if (!tr.querySelector("td")) {
    return null;
  }

  const [uploadedAtText, recordCountText, note] = [1, 2, 3].map((i) => {
    return tr.querySelector(`td:nth-child(${i})`)?.textContent;
  });

  const uploadedAt = extractDateString(uploadedAtText);

  if (!uploadedAt) {
    return null;
  }

  const recordCount = Number(recordCountText?.replace(/,/g, ""));

  const relativeZipUrl = tr.querySelector("td:nth-child(1) a")?.getAttribute("href");
  const zipUrl = new URL(relativeZipUrl ?? "", rootUrl);

  return {
    uploadedAt,
    recordCount,
    note: note ?? "",
    zipUrl,
  };
};

export const japanMarcBookOfferingTypes = ["単行・逐次刊行資料", "典拠"] as const;
export type JapanMarcBookOfferingType = typeof japanMarcBookOfferingTypes[number];

export type JapanMarcBookOffering = {
  type: JapanMarcBookOfferingType;
  uploadedAt: DateString;
  recordCount: number;
  note: string;
  zipUrl: URL;
};

export const parseJapanMarcBookOfferings = (html: string): JapanMarcBookOffering[] => {
  const dom = new JSDOM(html);

  const offerings = japanMarcBookOfferingTypes
    .flatMap((type) => {
      const listId = type === "単行・逐次刊行資料" ? "jmms" : "jma";
      const list = dom.window.document.querySelectorAll(`#${listId} + .dataSet tr`);

      return Array.from(list).map((tr) => {
        const parsed = parseTr(tr);

        if (!parsed) {
          return null;
        }

        return {
          type,
          ...parsed,
        };
      });
    })
    .filter(isNotNullish);

  return sortBy(offerings, "uploadedAt").reverse();
};
