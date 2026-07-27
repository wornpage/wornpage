import { describe, it, expect } from "bun:test";
import { apcaLc } from "../src/index.ts";

describe("apcaLc", () => {
  it("returns positive for dark text on white", () => {
    const lc = apcaLc("#000000", "#ffffff");
    expect(lc).toBeGreaterThan(0);
    expect(Math.abs(lc)).toBeGreaterThan(75);
  });

  it("returns negative for white text on black", () => {
    const lc = apcaLc("#ffffff", "#000000");
    expect(lc).toBeLessThan(0);
    expect(Math.abs(lc)).toBeGreaterThan(75);
  });

  it("returns low contrast for similar colors", () => {
    const lc = apcaLc("#cccccc", "#dddddd");
    expect(Math.abs(lc)).toBeLessThan(10);
  });

  it("is roughly symmetric in magnitude", () => {
    const forward = Math.abs(apcaLc("#333333", "#eeeeee"));
    const reverse = Math.abs(apcaLc("#eeeeee", "#333333"));
    expect(Math.abs(forward - reverse)).toBeLessThan(5);
  });

  it("handles short hex", () => {
    const lc = apcaLc("#000", "#fff");
    expect(Math.abs(lc)).toBeGreaterThan(75);
  });

  it("throws on unparseable input", () => {
    expect(() => apcaLc("var(--cockpit-text)", "#ffffff")).toThrow();
  });
});