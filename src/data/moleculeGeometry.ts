import type { MoleculeRecipe } from "../lib/chemistry";

export type MoleculeAtomPoint = {
  symbol: string;
  position: [number, number, number];
};

export type MoleculeBond = [number, number];

export type MoleculeGeometry = {
  atoms: MoleculeAtomPoint[];
  bonds: MoleculeBond[];
};

export function getMoleculeGeometry(recipe: MoleculeRecipe): MoleculeGeometry {
  switch (recipe.id) {
    case "water":
      return {
        atoms: [
          { symbol: "O", position: [0, 0, 0] },
          { symbol: "H", position: [-1.12, -0.72, 0] },
          { symbol: "H", position: [1.12, -0.72, 0] }
        ],
        bonds: [
          [0, 1],
          [0, 2]
        ]
      };
    case "carbon-dioxide":
      return {
        atoms: [
          { symbol: "O", position: [-1.55, 0, 0] },
          { symbol: "C", position: [0, 0, 0] },
          { symbol: "O", position: [1.55, 0, 0] }
        ],
        bonds: [
          [0, 1],
          [1, 2]
        ]
      };
    case "ammonia":
      return {
        atoms: [
          { symbol: "N", position: [0, 0.28, 0] },
          { symbol: "H", position: [-1.12, -0.65, 0.2] },
          { symbol: "H", position: [1.12, -0.65, 0.2] },
          { symbol: "H", position: [0, -0.65, -1.12] }
        ],
        bonds: [
          [0, 1],
          [0, 2],
          [0, 3]
        ]
      };
    case "methane":
      return {
        atoms: [
          { symbol: "C", position: [0, 0, 0] },
          { symbol: "H", position: [1.05, 1.05, 1.05] },
          { symbol: "H", position: [-1.05, -1.05, 1.05] },
          { symbol: "H", position: [-1.05, 1.05, -1.05] },
          { symbol: "H", position: [1.05, -1.05, -1.05] }
        ],
        bonds: [
          [0, 1],
          [0, 2],
          [0, 3],
          [0, 4]
        ]
      };
    case "sodium-chloride":
      return {
        atoms: [
          { symbol: "Na", position: [-0.9, 0, 0] },
          { symbol: "Cl", position: [0.9, 0, 0] }
        ],
        bonds: [[0, 1]]
      };
    default: {
      const symbols = Object.entries(recipe.atoms).flatMap(([symbol, count]) =>
        Array.from({ length: count }, () => symbol)
      );
      const spacing = symbols.length > 1 ? 1.5 : 0;
      const origin = ((symbols.length - 1) * spacing) / 2;

      return {
        atoms: symbols.map((symbol, index) => ({
          symbol,
          position: [index * spacing - origin, 0, 0]
        })),
        bonds: symbols.slice(1).map((_, index) => [index, index + 1] as MoleculeBond)
      };
    }
  }
}
