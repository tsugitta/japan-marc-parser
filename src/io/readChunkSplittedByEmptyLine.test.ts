import { expect, test } from "vitest";

import { readChunkSplittedByEmptyLine } from "./readChunkSplittedByEmptyLine";

test("readChunkSplittedByEmptyLine", async () => {
  let lastIndex = 0;
  let firstLines: string[] = [];

  await readChunkSplittedByEmptyLine({
    filePath: `${__dirname}/../__test__/jmo202243_confirmation/jmo202243_confirmation.txt`,
    onReadChunk: async ({ index, lines }) => {
      if (index === 0) {
        firstLines = lines;
      }

      lastIndex = index;
    },
  });

  expect(lastIndex).toBe(3555);

  expect(firstLines).toMatchInlineSnapshot(`
    [
      "000000001 000   00913cam a2200277 i 4500",
      "000000001 001   000009226517",
      "000000001 003   JTNDL",
      "000000001 005   20221101132654.0",
      "000000001 007   ta",
      "000000001 008   080121s2007    ja ||||g |||| ||||||jpn  ",
      "000000001 015   |a 21353965 |2 jnb",
      "000000001 020   |a 978-4-04-621880-3 : |c 2667円",
      "000000001 040   |a JTNDL |b jpn |c JTNDL |e ncr/1987",
      "000000001 084   |a KH612 |2 kktb",
      "000000001 084   |a 911.368 |2 njb/09",
      "000000001 090   |a KH612-J6",
      "000000001 24500 |6 880-01 |a 鳰の海 : |b 句集 / |c 田島和生 著.",
      "000000001 260   |6 880-02 |a 東京 : |b 角川書店, |c 2007.12.",
      "000000001 300   |a 243p ; |c 20cm.",
      "000000001 7001  |6 880-03 |a 田島, 和生, |d 1937- |0 00301932",
      "000000001 88000 |6 245-01/$1 |a ニオ ノ ウミ : |b クシュウ.",
      "000000001 88000 |6 245-01/(B |a Nio no umi : |b Kushu.",
      "000000001 880   |6 260-02/$1 |b カドカワ ショテン.",
      "000000001 880   |6 260-02/(B |b Kadokawa Shoten.",
      "000000001 8801  |6 700-03/$1 |a タジマ, カズオ, |d 1937- |0 00301932",
      "000000001 8801  |6 700-03/(B |a Tajima, Kazuo, |d 1937- |0 00301932",
    ]
  `);
});
