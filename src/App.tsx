import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Atom, Beaker, Brain, FlaskConical, Languages, Table2, Trophy } from "lucide-react";
import { Dashboard } from "./components/Dashboard";
import { LabWorkspace, type ExperimentChallenge } from "./components/LabWorkspace";
import { PeriodicTableOverlay } from "./components/PeriodicTableOverlay";
import { elements, getElement } from "./data/elements";
import { MOLECULE_RECIPES } from "./lib/chemistry";

type AppMode = "atoms" | "molecules" | "quiz" | "lab";
type Language = "ko" | "en";

const navItems: Array<{ id: AppMode; label: string; icon: typeof Atom }> = [
  { id: "atoms", label: "원소", icon: Atom },
  { id: "molecules", label: "분자", icon: Beaker },
  { id: "quiz", label: "퀴즈", icon: Brain },
  { id: "lab", label: "실험실", icon: FlaskConical }
];

const experimentRecipeIds = [
  "water",
  "carbon-dioxide",
  "ammonia",
  "methane",
  "hydrogen-chloride",
  "carbon-monoxide",
  "sulfur-dioxide",
  "hydrogen-peroxide",
  "methanol",
  "sodium-hydroxide"
];

export default function App() {
  const [selectedSymbol, setSelectedSymbol] = useState("O");
  const [mode, setMode] = useState<AppMode>("atoms");
  const [language, setLanguage] = useState<Language>("ko");
  const [showPeriodicTable, setShowPeriodicTable] = useState(false);
  const [showOrbitalCloud, setShowOrbitalCloud] = useState(false);
  const [activeExperiment, setActiveExperiment] = useState<ExperimentChallenge | null>(null);

  const selectedElement = useMemo(() => getElement(selectedSymbol), [selectedSymbol]);
  const todayExperiment = useMemo(() => getTodayExperiment(), []);
  const labActive = mode === "lab" || mode === "molecules";

  return (
    <div className="min-h-screen overflow-hidden bg-space-950 text-slate-100">
      <div className="app-shell">
        <header className="topbar">
          <button
            className="brand-button"
            type="button"
            onClick={() => {
              setMode("atoms");
              setShowPeriodicTable(false);
            }}
            aria-label="Atomix Lab home"
          >
            <span className="brand-mark">
              <Atom size={22} strokeWidth={2.4} />
            </span>
            <span>
              <span className="block text-sm font-semibold leading-4 text-white">Atomix Lab</span>
              <span className="block text-[11px] leading-4 text-slate-400">Interactive chemistry</span>
            </span>
          </button>

          <nav className="nav-tabs" aria-label="Primary navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  data-testid={`nav-${item.id}`}
                  className={active ? "nav-tab nav-tab-active" : "nav-tab"}
                  type="button"
                  onClick={() => setMode(item.id)}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="top-actions">
            <button
              data-testid="open-periodic-table"
              className="icon-button labeled"
              type="button"
              onClick={() => setShowPeriodicTable(true)}
              title="주기율표 열기"
            >
              <Table2 size={17} />
              <span>주기율표</span>
            </button>
            <button
              className="icon-button"
              type="button"
              onClick={() => setLanguage((current) => (current === "ko" ? "en" : "ko"))}
              title="언어 변경"
            >
              <Languages size={17} />
              <span>{language.toUpperCase()}</span>
            </button>
            <div className="profile-pill" title="학습 포인트">
              <Trophy size={16} />
              <span>1,260 pt</span>
            </div>
          </div>
        </header>

        <main className="relative min-h-0 flex-1">
          <AnimatePresence mode="wait">
            {labActive ? (
              <motion.div
                key="lab"
                className="h-full"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22 }}
              >
                <LabWorkspace
                  language={language}
                  activeExperiment={activeExperiment}
                  selectedElement={selectedElement}
                  onSelectElement={(symbol) => {
                    setSelectedSymbol(symbol);
                    setMode("atoms");
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                className="h-full"
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.22 }}
              >
                <Dashboard
                  element={selectedElement}
                  elements={elements}
                  language={language}
                  showOrbitalCloud={showOrbitalCloud}
                  quizFocus={mode === "quiz"}
                  onOpenPeriodicTable={() => setShowPeriodicTable(true)}
                  onStartExperiment={() => {
                    setActiveExperiment(todayExperiment);
                    setShowPeriodicTable(false);
                    setMode("lab");
                  }}
                  onToggleOrbitalCloud={() => setShowOrbitalCloud((current) => !current)}
                  onSelectElement={setSelectedSymbol}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <PeriodicTableOverlay
        elements={elements}
        language={language}
        open={showPeriodicTable}
        selectedSymbol={selectedSymbol}
        onClose={() => setShowPeriodicTable(false)}
        onSelect={(symbol) => {
          setSelectedSymbol(symbol);
          setMode("atoms");
          setShowPeriodicTable(false);
        }}
      />
    </div>
  );
}

function getTodayExperiment(): ExperimentChallenge {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  const recipeId = experimentRecipeIds[dayIndex % experimentRecipeIds.length];
  const recipe = MOLECULE_RECIPES.find((item) => item.id === recipeId) ?? MOLECULE_RECIPES[0];
  return {
    id: recipe.id,
    title: `오늘의 실험: ${recipe.formula} 만들기`,
    description: `${recipe.koreanName}(${recipe.name}) 레시피에 맞춰 필요한 원자들을 추가하세요.`,
    targetFormula: recipe.formula,
    targetAtoms: recipeAtoms(recipe.atoms)
  };
}

function recipeAtoms(atoms: Record<string, number>): string[] {
  return Object.entries(atoms).flatMap(([symbol, count]) => Array.from({ length: count }, () => symbol));
}
