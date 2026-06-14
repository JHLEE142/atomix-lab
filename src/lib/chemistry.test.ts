import { describe, expect, it } from "vitest";
import {
  buildFormula,
  getElectronShells,
  getElectronShellsFromConfiguration,
  identifyMolecule,
  summarizeAtoms
} from "./chemistry";

describe("chemistry helpers", () => {
  it("builds Bohr-style electron shells for sodium", () => {
    expect(getElectronShells(11)).toEqual([2, 8, 1]);
  });

  it("derives shells from noble-gas electron configurations", () => {
    expect(getElectronShellsFromConfiguration("[Ar]4s2 3d6")).toEqual([2, 8, 14, 2]);
    expect(getElectronShellsFromConfiguration("[Rn]7s2 7p6 5f14 6d10 (predicted)")).toEqual([
      2, 8, 18, 32, 32, 18, 8
    ]);
  });

  it("summarizes selected atoms by symbol", () => {
    expect(summarizeAtoms(["H", "O", "H"])).toEqual({ H: 2, O: 1 });
  });

  it("uses conventional formula order for water and carbon dioxide", () => {
    expect(buildFormula({ H: 2, O: 1 })).toBe("H2O");
    expect(buildFormula({ C: 1, O: 2 })).toBe("CO2");
  });

  it("recognizes supported molecule recipes regardless of atom order", () => {
    expect(identifyMolecule(["H", "O", "H"])).toMatchObject({
      formula: "H2O",
      name: "Water",
      koreanName: "물"
    });

    expect(identifyMolecule(["Cl", "Na"])).toMatchObject({
      formula: "NaCl",
      name: "Sodium Chloride"
    });
  });

  it("returns null for unsupported combinations", () => {
    expect(identifyMolecule(["Na", "O"])).toBeNull();
  });
});
