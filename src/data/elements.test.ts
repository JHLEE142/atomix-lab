import { describe, expect, it } from "vitest";
import { elements, getElement } from "./elements";

describe("periodic table element data", () => {
  it("contains the complete 118-element periodic table", () => {
    expect(elements).toHaveLength(118);
    expect(elements[0]).toMatchObject({ atomicNumber: 1, symbol: "H" });
    expect(elements[117]).toMatchObject({ atomicNumber: 118, symbol: "Og" });
  });

  it("maps every atomic number exactly once", () => {
    const atomicNumbers = new Set(elements.map((element) => element.atomicNumber));
    expect(atomicNumbers.size).toBe(118);
    expect(Math.min(...atomicNumbers)).toBe(1);
    expect(Math.max(...atomicNumbers)).toBe(118);
  });

  it("has usable atomic-structure values for every element", () => {
    for (const element of elements) {
      expect(element.radiusPm, `${element.symbol} radius`).toBeGreaterThan(0);
      expect(element.shells.reduce((total, shell) => total + shell, 0), `${element.symbol} shells`).toBe(
        element.atomicNumber
      );
    }
  });

  it("derives shell structures from electron configurations for heavier atoms", () => {
    expect(getElement("Fe").shells).toEqual([2, 8, 14, 2]);
    expect(getElement("Au").shells).toEqual([2, 8, 18, 32, 18, 1]);
    expect(getElement("Og").shells).toEqual([2, 8, 18, 32, 32, 18, 8]);
  });

  it("places main table and f-block cells into a complete grid", () => {
    expect(getElement("He")).toMatchObject({ period: 1, group: 18 });
    expect(getElement("La")).toMatchObject({ period: 6, group: 3 });
    expect(getElement("Ce")).toMatchObject({ period: 8, group: 4 });
    expect(getElement("Ac")).toMatchObject({ period: 7, group: 3 });
    expect(getElement("Th")).toMatchObject({ period: 9, group: 4 });
  });
});
