import fetch from "node-fetch";

export const rootUrl = "https://www.ndl.go.jp";

const listUrlPath = "jp/data/data_service/jnb_product.html";
const listUrl = new URL(listUrlPath, rootUrl);

export const fetchJapanMarcBookOfferingsHtml = async () => {
  const response = await fetch(listUrl);
  const html = await response.text();

  return html;
};
