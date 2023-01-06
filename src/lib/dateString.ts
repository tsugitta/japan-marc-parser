type PositiveNumberChar = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type NumberChar = "0" | PositiveNumberChar;

type MonthString = `${"0"}${PositiveNumberChar}` | "10" | "11" | "12";
type DayString = `${"0"}${PositiveNumberChar}` | `${"1" | "2"}${NumberChar}` | `${"3"}${"0" | "1"}`;

// NOTE: 1990-01-01 ~ 2099-12-31 のように幅広くすると、各所の型検査にコストがかかるため、ある程度絞り込んでいる
export type DateString = `202${NumberChar}-${MonthString}-${DayString}`;

export const extractDateString = (text?: string | null): DateString | null => {
  if (!text) {
    return null;
  }

  const matched = text.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/);

  if (!matched) {
    return null;
  }

  const [, year, month, day] = matched;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}` as DateString;
};
