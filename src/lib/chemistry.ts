export type AtomCounts = Record<string, number>;

export type MoleculeRecipe = {
  id: string;
  formula: string;
  name: string;
  koreanName: string;
  atoms: AtomCounts;
  description: string;
  geometry: "linear" | "bent" | "trigonal-pyramidal" | "tetrahedral" | "diatomic" | "ionic-pair";
};

export const MOLECULE_RECIPES: MoleculeRecipe[] = [
  {
    id: "water",
    formula: "H2O",
    name: "Water",
    koreanName: "물",
    atoms: { H: 2, O: 1 },
    description: "A bent molecule with two hydrogen atoms bonded to oxygen.",
    geometry: "bent"
  },
  {
    id: "carbon-dioxide",
    formula: "CO2",
    name: "Carbon Dioxide",
    koreanName: "이산화탄소",
    atoms: { C: 1, O: 2 },
    description: "A linear molecule made from one carbon atom and two oxygen atoms.",
    geometry: "linear"
  },
  {
    id: "ammonia",
    formula: "NH3",
    name: "Ammonia",
    koreanName: "암모니아",
    atoms: { N: 1, H: 3 },
    description: "A trigonal pyramidal molecule with a lone pair on nitrogen.",
    geometry: "trigonal-pyramidal"
  },
  {
    id: "methane",
    formula: "CH4",
    name: "Methane",
    koreanName: "메테인",
    atoms: { C: 1, H: 4 },
    description: "A tetrahedral molecule with carbon at the center.",
    geometry: "tetrahedral"
  },
  {
    id: "oxygen",
    formula: "O2",
    name: "Oxygen",
    koreanName: "산소",
    atoms: { O: 2 },
    description: "A diatomic oxygen molecule.",
    geometry: "diatomic"
  },
  {
    id: "hydrogen",
    formula: "H2",
    name: "Hydrogen",
    koreanName: "수소",
    atoms: { H: 2 },
    description: "A diatomic hydrogen molecule.",
    geometry: "diatomic"
  },
  {
    id: "sodium-chloride",
    formula: "NaCl",
    name: "Sodium Chloride",
    koreanName: "염화나트륨",
    atoms: { Na: 1, Cl: 1 },
    description: "A simplified ionic pair model for sodium and chloride ions.",
    geometry: "ionic-pair"
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
