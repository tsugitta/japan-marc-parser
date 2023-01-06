import { describe, expect, test } from "vitest";

import { extractDateString } from "./dateString";

describe("extractDateString", () => {
  test("日付を抜き出す", () => {
    expect(extractDateString("2022年12月23日提供分（ZIP: 3.49 MB）")).toBe("2022-12-23");

    expect(extractDateString("2022年12月9日提供分（ZIP: 3.71MB）")).toBe("2022-12-09");

    expect(extractDateString("2022年1月7日提供分（ZIP: 3.75MB）")).toBe("2022-01-07");
  });
});
