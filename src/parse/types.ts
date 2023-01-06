export type JapanMarkBook = {
  レコードラベル: {
    レコードステータス: "訂正" | "削除" | "新規";
    レコード種別:
      | "文字資料"
      | "楽譜"
      | "地図資料"
      | "映像資料"
      | "録音資料（音楽録音資料を除く）"
      | "音楽録音資料"
      | "静止画資料"
      | "電子資料"
      | "文字資料（書写資料）";
  };
  レコード管理番号: string | null;
  "国際標準図書番号（ISBN）": {
    ISBN: string | null;
    "入手条件・定価": string | null;
  };
  タイトル: {
    本タイトル: string | null;
    並列タイトル: string | null;
    本タイトルに関係する責任表示: string | null;
    巻次または部編番号: string | null;
  };
  サブタイトル: string[];
  版表示: {
    版次: string | null;
    版に関係する責任表示等: string | null;
  };
  "出版・頒布等に関する事項": {
    "出版地・頒布地等": string | null;
    "出版者・頒布者等": string | null;
    "出版年月・頒布年月等": string | null;
  };
  出版表示等: Array<{
    出版日付等: string | null;
    出版社等: string | null;
  }>;
  シリーズ表示: {
    読みの対応関係: string | null;
    シリーズのタイトル等: string | null;
    シリーズのISSN等: string | null;
    シリーズ内番号等: string | null;
  };
  著者: string[];
  内容細目: {
    タイトル: string[];
    内容細目等: string[];
    責任表示: string[];
  };
  一般注記: string[];
};
