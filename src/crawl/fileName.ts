// URL 例: https://www.ndl.go.jp/jp/data/data_service/jm/jm02/__icsFiles/afieldfile/2022/12/23/jma202250.zip

export const urlToFileName = (url: string) => {
  const matched = url.match(/data_service(.+)/);

  if (!matched) {
    throw new Error(`URL が不正です: ${url}`);
  }

  return matched[1].replace(/\//g, "_");
};
