import { cloneDeep, mergeWith } from "lodash";

import { JapanMarkBook } from "./types";

export const trimLastSeparatorCharacter = (value: string) => {
  const separatorCharacters = [".", ":", "/", "=", ",", ";"];

  const lastCharacter = value.slice(-1);

  if (separatorCharacters.includes(lastCharacter)) {
    return value.slice(0, -1).trim();
  } else {
    return value;
  }
};

export const extractFirstString = (value: string) => {
  const matched = value.trim().match(/^(\S+)\s+(.+)/);

  return {
    firstString: matched?.[1] ?? "",
    rest: matched?.[2] ?? "",
  };
};

/**
 * フィールド ID は 5 桁。
 * 出版社 "264 1" のように間に空白が入る場合がある。
 */
export const extractFieldNumber = (value: string) => {
  return {
    fieldNumber: value.trim().slice(0, 5).trim(),
    rest: value.trim().slice(5).trim(),
  };
};

export const extractSubFields = ({ value }: { value: string }) => {
  const subFields = value
    .split("|")
    .filter((_, index) => index > 0) // NOTE: 先頭の文字は "|" 始まりでないので除外する
    .map((subField) => {
      const { firstString: subFieldId, rest } = extractFirstString(subField);

      return {
        subFieldId,
        value: trimLastSeparatorCharacter(rest.trim()),
      };
    });

  return subFields;
};

export const extractSubField = ({ value, subFieldId }: { value: string; subFieldId: string }) => {
  return extractSubFields({ value }).find((subField) => subField.subFieldId === subFieldId)?.value ?? null;
};

export const extractMultipleSubField = ({ value, subFieldId }: { value: string; subFieldId: string }) => {
  return extractSubFields({ value })
    .filter((subField) => subField.subFieldId === subFieldId)
    .map((subField) => subField.value);
};

const fields = [
  {
    fieldNumber: "000",
    fieldName: "レコードラベル",
    multiple: false,
    defaultValue: {
      レコードステータス: null,
      レコード種別: null,
    },
    parse: (value: string): JapanMarkBook["レコードラベル"] => {
      const { firstString } = extractFirstString(value);

      const matched = firstString.match(/^(\d{5})([cdn])([acegijkmt])([ims])$/);

      if (!matched) {
        throw new Error(`レコードラベルのパースに失敗しました。 ${firstString}`);
      }

      const レコードステータス = (() => {
        switch (matched[2]) {
          case "c":
            return "訂正";
          case "d":
            return "削除";
          case "n":
            return "新規";
          default:
            throw new Error("unreachable");
        }
      })();

      const レコード種別 = (() => {
        switch (matched[3]) {
          case "a":
            return "文字資料";
          case "c":
            return "楽譜";
          case "e":
            return "地図資料";
          case "g":
            return "映像資料";
          case "i":
            return "録音資料（音楽録音資料を除く）";
          case "j":
            return "音楽録音資料";
          case "k":
            return "静止画資料";
          case "m":
            return "電子資料";
          case "t":
            return "文字資料（書写資料）";
          default:
            throw new Error("unreachable");
        }
      })();

      return {
        レコードステータス,
        レコード種別,
      };
    },
  },
  {
    fieldNumber: "001",
    fieldName: "レコード管理番号",
    multiple: false,
    defaultValue: "",
    parse: (value: string) => {
      return value;
    },
  },
  {
    fieldNumber: "020",
    fieldName: "国際標準図書番号（ISBN）",
    multiple: false,
    defaultValue: {
      ISBN: null,
      "入手条件・定価": null,
    },
    parse: (value: string) => {
      return {
        ISBN: extractSubField({ value, subFieldId: "a" }),
        "入手条件・定価": extractSubField({ value, subFieldId: "c" }),
      };
    },
  },
  {
    fieldNumber: "24500",
    fieldName: "タイトル",
    multiple: false,
    defaultValue: {
      本タイトル: null,
      並列タイトル: null,
      本タイトルに関係する責任表示: null,
      巻次または部編番号: null,
    },
    parse: (value: string) => {
      const 本タイトル = extractSubField({ value, subFieldId: "a" });
      const 並列タイトル = extractSubField({ value, subFieldId: "b" });
      const 本タイトルに関係する責任表示 = extractSubField({
        value,
        subFieldId: "c",
      });
      const 巻次または部編番号 = extractSubField({ value, subFieldId: "n" });

      return {
        本タイトル,
        並列タイトル,
        本タイトルに関係する責任表示,
        巻次または部編番号,
      };
    },
  },
  {
    fieldNumber: "246XX",
    fieldName: "サブタイトル",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      const targetSubFieldIds = ["a", "b", "g", "i", "n", "p"];

      const targetSubFields = extractSubFields({ value }).filter(({ subFieldId }) =>
        targetSubFieldIds.includes(subFieldId),
      );

      return targetSubFields.map(({ value }) => value).join(" ");
    },
  },
  {
    fieldNumber: "250",
    fieldName: "版表示",
    multiple: false,
    defaultValue: {
      版次: null,
      版に関係する責任表示等: null,
    },
    parse: (value: string) => {
      const 版次 = extractSubField({ value, subFieldId: "a" });
      const 版に関係する責任表示等 = extractSubField({ value, subFieldId: "b" });

      return {
        版次,
        版に関係する責任表示等,
      };
    },
  },
  {
    fieldNumber: "260",
    fieldName: "出版・頒布等に関する事項",
    multiple: false,
    defaultValue: {
      "出版地・頒布地等": null,
      "出版者・頒布者等": null,
      "出版年月・頒布年月等": null,
    },
    parse: (value: string) => {
      const 出版地頒布地等 = extractSubField({ value, subFieldId: "a" });
      const 出版者頒布者等 = extractSubField({ value, subFieldId: "b" });
      const 出版年月頒布年月等 = extractSubField({ value, subFieldId: "c" });

      return {
        "出版地・頒布地等": 出版地頒布地等,
        "出版者・頒布者等": 出版者頒布者等,
        "出版年月・頒布年月等": 出版年月頒布年月等,
      };
    },
  },
  {
    fieldNumber: "264XX",
    fieldName: "出版表示等",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      const 出版社等 = extractSubField({ value, subFieldId: "b" });
      const 出版日付等 = extractSubField({ value, subFieldId: "c" });

      return {
        出版社等,
        出版日付等,
      };
    },
  },
  {
    fieldNumber: "4900",
    fieldName: "シリーズ表示",
    multiple: false,
    defaultValue: {
      読みの対応関係: null,
      シリーズのタイトル等: null,
      シリーズのISSN等: null,
      シリーズ内番号等: null,
    },
    parse: (value: string) => {
      const 読みの対応関係 = extractSubField({ value, subFieldId: "6" });
      const シリーズのタイトル等 = extractSubField({ value, subFieldId: "a" });
      const シリーズのISSN等 = extractSubField({ value, subFieldId: "x" });
      const シリーズ内番号等 = extractSubField({ value, subFieldId: "v" });

      return {
        読みの対応関係,
        シリーズのタイトル等,
        シリーズのISSN等,
        シリーズ内番号等,
      };
    },
  },
  {
    fieldNumber: "500",
    fieldName: "一般注記",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      const 一般注記 = extractSubField({ value, subFieldId: "a" });

      return 一般注記;
    },
  },
  {
    fieldNumber: "50500",
    fieldName: "内容細目",
    multiple: true,
    defaultValue: {
      内容細目等: [],
      タイトル: [],
      責任表示: [],
    },
    parse: (value: string) => {
      const 内容細目等 = extractMultipleSubField({ value, subFieldId: "a" });
      const タイトル = extractMultipleSubField({ value, subFieldId: "t" });
      const 責任表示 = extractMultipleSubField({ value, subFieldId: "r" });

      return {
        内容細目等,
        タイトル,
        責任表示,
      };
    },
  },
  {
    fieldNumber: "70XXX",
    fieldName: "著者",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      return extractSubField({ value, subFieldId: "a" });
    },
  },
  {
    fieldNumber: "71XXX",
    fieldName: "著者",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      return extractSubField({ value, subFieldId: "a" });
    },
  },
  {
    fieldNumber: "72XXX",
    fieldName: "著者",
    multiple: true,
    defaultValue: [],
    parse: (value: string) => {
      return extractSubField({ value, subFieldId: "a" });
    },
  },
] as const;

type FieldName = typeof fields[number]["fieldName"];

export const parse = (lines: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: Partial<Record<FieldName, any>> = {};

  fields.forEach((field) => {
    if (!res[field.fieldName]) {
      res[field.fieldName] = cloneDeep(field.defaultValue);
    }
  });

  lines.forEach((line) => {
    const { rest } = extractFirstString(line);
    const { fieldNumber, rest: fieldValue } = extractFieldNumber(rest);

    const field = fields.find(
      (field) => field.fieldNumber === fieldNumber || fieldNumber.startsWith(field.fieldNumber.replace(/X/g, "")),
    );

    if (!field) {
      // NOTE: 未対応フィールド
      return;
    }

    const parsed = field.parse(fieldValue);

    if (field.multiple) {
      if (Array.isArray(res[field.fieldName])) {
        res[field.fieldName] = [...res[field.fieldName], parsed];
      } else {
        mergeWith(res[field.fieldName], parsed, function (a: unknown, b: unknown) {
          if (Array.isArray(a) && Array.isArray(b)) {
            return a.concat(b);
          }
        });
      }
    } else {
      res[field.fieldName] = parsed;
    }
  });

  return res as JapanMarkBook;
};
