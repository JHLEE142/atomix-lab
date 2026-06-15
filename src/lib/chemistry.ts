export type AtomCounts = Record<string, number>;

export type MoleculeRecipe = {
  id: string;
  formula: string;
  name: string;
  koreanName: string;
  atoms: AtomCounts;
  description: string;
  geometry:
    | "linear"
    | "bent"
    | "trigonal-pyramidal"
    | "tetrahedral"
    | "trigonal-planar"
    | "diatomic"
    | "chain"
    | "ionic-pair";
  sourceUrl: string;
};

export const MOLECULE_RECIPES: MoleculeRecipe[] = [
  {
    id: "water",
    formula: "H2O",
    name: "Water",
    koreanName: "물",
    atoms: { H: 2, O: 1 },
    description: "A bent molecule with two hydrogen atoms bonded to oxygen.",
    geometry: "bent",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Water"
  },
  {
    id: "carbon-dioxide",
    formula: "CO2",
    name: "Carbon Dioxide",
    koreanName: "이산화탄소",
    atoms: { C: 1, O: 2 },
    description: "A linear molecule made from one carbon atom and two oxygen atoms.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Carbon-dioxide"
  },
  {
    id: "ammonia",
    formula: "NH3",
    name: "Ammonia",
    koreanName: "암모니아",
    atoms: { N: 1, H: 3 },
    description: "A trigonal pyramidal molecule with a lone pair on nitrogen.",
    geometry: "trigonal-pyramidal",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Ammonia"
  },
  {
    id: "methane",
    formula: "CH4",
    name: "Methane",
    koreanName: "메테인",
    atoms: { C: 1, H: 4 },
    description: "A tetrahedral molecule with carbon at the center.",
    geometry: "tetrahedral",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Methane"
  },
  {
    id: "oxygen",
    formula: "O2",
    name: "Oxygen",
    koreanName: "산소",
    atoms: { O: 2 },
    description: "A diatomic oxygen molecule.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Oxygen"
  },
  {
    id: "hydrogen",
    formula: "H2",
    name: "Hydrogen",
    koreanName: "수소",
    atoms: { H: 2 },
    description: "A diatomic hydrogen molecule.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen"
  },
  {
    id: "sodium-chloride",
    formula: "NaCl",
    name: "Sodium Chloride",
    koreanName: "염화나트륨",
    atoms: { Na: 1, Cl: 1 },
    description: "A simplified ionic pair model for sodium and chloride ions.",
    geometry: "ionic-pair",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-chloride"
  },
  {
    id: "nitrogen",
    formula: "N2",
    name: "Nitrogen",
    koreanName: "질소",
    atoms: { N: 2 },
    description: "A diatomic nitrogen molecule.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Nitrogen"
  },
  {
    id: "chlorine",
    formula: "Cl2",
    name: "Chlorine",
    koreanName: "염소",
    atoms: { Cl: 2 },
    description: "A diatomic chlorine molecule.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Chlorine"
  },
  {
    id: "ozone",
    formula: "O3",
    name: "Ozone",
    koreanName: "오존",
    atoms: { O: 3 },
    description: "A bent triatomic oxygen molecule.",
    geometry: "bent",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Ozone"
  },
  {
    id: "carbon-monoxide",
    formula: "CO",
    name: "Carbon Monoxide",
    koreanName: "일산화탄소",
    atoms: { C: 1, O: 1 },
    description: "A linear diatomic molecule of carbon and oxygen.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Carbon-monoxide"
  },
  {
    id: "hydrogen-chloride",
    formula: "HCl",
    name: "Hydrogen Chloride",
    koreanName: "염화수소",
    atoms: { H: 1, Cl: 1 },
    description: "A polar diatomic molecule.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen-chloride"
  },
  {
    id: "hydrogen-fluoride",
    formula: "HF",
    name: "Hydrogen Fluoride",
    koreanName: "플루오린화수소",
    atoms: { H: 1, F: 1 },
    description: "A polar diatomic hydrogen halide.",
    geometry: "diatomic",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen-fluoride"
  },
  {
    id: "hydrogen-sulfide",
    formula: "H2S",
    name: "Hydrogen Sulfide",
    koreanName: "황화수소",
    atoms: { H: 2, S: 1 },
    description: "A bent molecule with sulfur at the center.",
    geometry: "bent",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen-sulfide"
  },
  {
    id: "sulfur-dioxide",
    formula: "SO2",
    name: "Sulfur Dioxide",
    koreanName: "이산화황",
    atoms: { S: 1, O: 2 },
    description: "A bent sulfur oxide molecule.",
    geometry: "bent",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sulfur-dioxide"
  },
  {
    id: "sulfur-trioxide",
    formula: "SO3",
    name: "Sulfur Trioxide",
    koreanName: "삼산화황",
    atoms: { S: 1, O: 3 },
    description: "A trigonal planar sulfur oxide molecule.",
    geometry: "trigonal-planar",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sulfur-trioxide"
  },
  {
    id: "nitric-oxide",
    formula: "NO",
    name: "Nitric Oxide",
    koreanName: "일산화질소",
    atoms: { N: 1, O: 1 },
    description: "A linear diatomic nitrogen oxide.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Nitric-oxide"
  },
  {
    id: "nitrogen-dioxide",
    formula: "NO2",
    name: "Nitrogen Dioxide",
    koreanName: "이산화질소",
    atoms: { N: 1, O: 2 },
    description: "A bent nitrogen oxide molecule.",
    geometry: "bent",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Nitrogen-dioxide"
  },
  {
    id: "nitrous-oxide",
    formula: "N2O",
    name: "Nitrous Oxide",
    koreanName: "아산화질소",
    atoms: { N: 2, O: 1 },
    description: "A linear nitrogen oxide molecule.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Nitrous-oxide"
  },
  {
    id: "hydrogen-cyanide",
    formula: "HCN",
    name: "Hydrogen Cyanide",
    koreanName: "사이안화수소",
    atoms: { H: 1, C: 1, N: 1 },
    description: "A linear molecule containing a carbon-nitrogen triple bond.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen-cyanide"
  },
  {
    id: "acetylene",
    formula: "C2H2",
    name: "Acetylene",
    koreanName: "아세틸렌",
    atoms: { C: 2, H: 2 },
    description: "A linear alkyne molecule.",
    geometry: "linear",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Acetylene"
  },
  {
    id: "ethylene",
    formula: "C2H4",
    name: "Ethylene",
    koreanName: "에틸렌",
    atoms: { C: 2, H: 4 },
    description: "A planar alkene molecule.",
    geometry: "trigonal-planar",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Ethylene"
  },
  {
    id: "ethane",
    formula: "C2H6",
    name: "Ethane",
    koreanName: "에테인",
    atoms: { C: 2, H: 6 },
    description: "A simple alkane with two tetrahedral carbon centers.",
    geometry: "chain",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Ethane"
  },
  {
    id: "methanol",
    formula: "CH3OH",
    name: "Methanol",
    koreanName: "메탄올",
    atoms: { C: 1, H: 4, O: 1 },
    description: "A simple alcohol; this recipe is a formula-based classroom model.",
    geometry: "chain",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Methanol"
  },
  {
    id: "ethanol",
    formula: "C2H5OH",
    name: "Ethanol",
    koreanName: "에탄올",
    atoms: { C: 2, H: 6, O: 1 },
    description: "A common alcohol; this recipe uses formula matching, not isomer detection.",
    geometry: "chain",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Ethanol"
  },
  {
    id: "hydrogen-peroxide",
    formula: "H2O2",
    name: "Hydrogen Peroxide",
    koreanName: "과산화수소",
    atoms: { H: 2, O: 2 },
    description: "A peroxide molecule with an oxygen-oxygen bond.",
    geometry: "chain",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Hydrogen-peroxide"
  },
  {
    id: "sodium-hydroxide",
    formula: "NaOH",
    name: "Sodium Hydroxide",
    koreanName: "수산화나트륨",
    atoms: { Na: 1, O: 1, H: 1 },
    description: "A simplified ionic formula model for sodium hydroxide.",
    geometry: "ionic-pair",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-hydroxide"
  },
  {
    id: "sodium-fluoride",
    formula: "NaF",
    name: "Sodium Fluoride",
    koreanName: "플루오린화나트륨",
    atoms: { Na: 1, F: 1 },
    description: "A simplified ionic pair model.",
    geometry: "ionic-pair",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-fluoride"
  },
  {
    id: "sodium-oxide",
    formula: "Na2O",
    name: "Sodium Oxide",
    koreanName: "산화나트륨",
    atoms: { Na: 2, O: 1 },
    description: "A simplified ionic formula model.",
    geometry: "ionic-pair",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-oxide"
  },
  {
    id: "sodium-sulfide",
    formula: "Na2S",
    name: "Sodium Sulfide",
    koreanName: "황화나트륨",
    atoms: { Na: 2, S: 1 },
    description: "A simplified ionic formula model.",
    geometry: "ionic-pair",
    sourceUrl: "https://pubchem.ncbi.nlm.nih.gov/compound/Sodium-sulfide"
  }
];

const formulaOrder = ["C", "H", "N", "O", "F", "Na", "Cl", "S"];

const nobleGasCoreShells: Record<string, number[]> = {
  He: [2],
  Ne: [2, 8],
  Ar: [2, 8, 8],
  Kr: [2, 8, 18, 8],
  Xe: [2, 8, 18, 18, 8],
  Rn: [2, 8, 18, 32, 18, 8],
  Og: [2, 8, 18, 32, 32, 18, 8]
};

export function getElectronShells(atomicNumber: number): number[] {
  if (!Number.isInteger(atomicNumber) || atomicNumber < 1) {
    throw new Error("Atomic number must be a positive integer.");
  }

  const shellCapacities = [2, 8, 18, 32];
  const shells: number[] = [];
  let remainingElectrons = atomicNumber;

  for (const capacity of shellCapacities) {
    if (remainingElectrons <= 0) break;
    const electronsInShell = Math.min(capacity, remainingElectrons);
    shells.push(electronsInShell);
    remainingElectrons -= electronsInShell;
  }

  if (remainingElectrons > 0) {
    shells.push(remainingElectrons);
  }

  return shells;
}

export function getElectronShellsFromConfiguration(electronConfiguration: string): number[] {
  const normalizedConfiguration = electronConfiguration
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const coreMatch = normalizedConfiguration.match(/^\[([A-Z][a-z]?)\]/);
  const shells = [...(coreMatch ? nobleGasCoreShells[coreMatch[1]] ?? [] : [])];
  const orbitalPattern = /([1-7])([spdfg])(\d+)/g;

  for (const match of normalizedConfiguration.matchAll(orbitalPattern)) {
    const shellIndex = Number(match[1]) - 1;
    const electronCount = Number(match[3]);
    shells[shellIndex] = (shells[shellIndex] ?? 0) + electronCount;
  }

  return shells.filter((shell) => shell > 0);
}

export function summarizeAtoms(symbols: string[]): AtomCounts {
  return symbols.reduce<AtomCounts>((summary, symbol) => {
    summary[symbol] = (summary[symbol] ?? 0) + 1;
    return summary;
  }, {});
}

export function buildFormula(counts: AtomCounts): string {
  const orderedSymbols = Object.keys(counts).sort((left, right) => {
    const leftIndex = formulaOrder.indexOf(left);
    const rightIndex = formulaOrder.indexOf(right);

    if (leftIndex !== -1 || rightIndex !== -1) {
      return normalizeOrderIndex(leftIndex) - normalizeOrderIndex(rightIndex);
    }

    return left.localeCompare(right);
  });

  return orderedSymbols
    .map((symbol) => `${symbol}${counts[symbol] > 1 ? counts[symbol] : ""}`)
    .join("");
}

export function identifyMolecule(symbols: string[]): MoleculeRecipe | null {
  const selectedCounts = summarizeAtoms(symbols);
  const selectedKey = countsKey(selectedCounts);
  return MOLECULE_RECIPES.find((recipe) => countsKey(recipe.atoms) === selectedKey) ?? null;
}

export function countsKey(counts: AtomCounts): string {
  return Object.keys(counts)
    .sort()
    .map((symbol) => `${symbol}:${counts[symbol]}`)
    .join("|");
}

function normalizeOrderIndex(index: number): number {
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}
