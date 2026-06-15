import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ExternalLink, FlaskConical, RotateCcw, Undo2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getElement, labPalette, type ElementRecord } from "../data/elements";
import { buildFormula, identifyMolecule, summarizeAtoms } from "../lib/chemistry";
import { LabScene } from "./LabScene";

export type ExperimentChallenge = {
  id: string;
  title: string;
  description: string;
  targetFormula: string;
  targetAtoms: string[];
};

type LabWorkspaceProps = {
  language: "ko" | "en";
  activeExperiment: ExperimentChallenge | null;
  selectedElement: ElementRecord;
  onSelectElement: (symbol: string) => void;
};

export function LabWorkspace({ language, activeExperiment, selectedElement, onSelectElement }: LabWorkspaceProps) {
  const [selectedAtoms, setSelectedAtoms] = useState<string[]>([]);
  const molecule = useMemo(() => identifyMolecule(selectedAtoms), [selectedAtoms]);
  const selectedFormula = molecule?.formula ?? (selectedAtoms.length ? buildFormula(summarizeAtoms(selectedAtoms)) : "Ø");

  function addAtom(symbol: string) {
    setSelectedAtoms((current) => {
      if (current.length >= 9) return current;
      return [...current, symbol];
    });
  }

  return (
    <section className="lab-grid">
      <aside className="side-panel palette-panel">
        <div className="panel-kicker">
          <FlaskConical size={14} />
          Element Palette
        </div>
        <h1>분자 결합 실험실</h1>
        <p>원소 버튼을 눌러 지원되는 대표 분자 레시피를 조립하세요. 실제 반응 조건은 단순화했습니다.</p>

        {activeExperiment ? (
          <div className="experiment-banner">
            <span className="panel-kicker">Today's Experiment</span>
            <h2>{activeExperiment.title}</h2>
            <p>{activeExperiment.description}</p>
            <div className="experiment-target-row" aria-label="Target atoms">
              {activeExperiment.targetAtoms.map((symbol, index) => (
                <span key={`${symbol}-${index}`}>{symbol}</span>
              ))}
              <strong>{formatFormula(activeExperiment.targetFormula)}</strong>
            </div>
          </div>
        ) : null}

        <div className="palette-list">
          {labPalette.map((symbol) => {
            const element = getElement(symbol);
            return (
              <button
                key={symbol}
                data-testid={`palette-${symbol}`}
                className="palette-item"
                type="button"
                onClick={() => addAtom(symbol)}
                style={{ "--element-color": element.color } as React.CSSProperties}
              >
                <span>{symbol}</span>
                <strong>{language === "ko" ? element.koreanName : element.name}</strong>
                <small>#{element.atomicNumber}</small>
              </button>
            );
          })}
        </div>

        <div className="selected-atom-box">
          <span>Current Formula</span>
          <strong>{formatFormula(selectedFormula)}</strong>
          <div className="atom-token-row">
            {selectedAtoms.length ? (
              selectedAtoms.map((symbol, index) => (
                <button
                  key={`${symbol}-${index}`}
                  type="button"
                  className="atom-token"
                  onClick={() =>
                    setSelectedAtoms((current) => current.filter((_, atomIndex) => atomIndex !== index))
                  }
                >
                  {symbol}
                </button>
              ))
            ) : (
              <small>원소를 선택하면 여기에 누적됩니다.</small>
            )}
          </div>
        </div>
      </aside>

      <section className="lab-stage">
        <div className="stage-header">
          <div>
            <span className="panel-kicker">
              <FlaskConical size={14} />
              Molecular Workspace
            </span>
            <h2>
              {molecule ? `${molecule.name} (${formatFormula(molecule.formula)})` : "Bonding Space"}
              <span>
                {molecule
                  ? `${molecule.koreanName} · ${formatGeometryLabel(molecule.geometry)}`
                  : "Click atoms to test a supported recipe"}
              </span>
            </h2>
          </div>

          <div className="stage-controls">
            <button
              className="segmented-control"
              type="button"
              onClick={() => setSelectedAtoms((current) => current.slice(0, -1))}
              disabled={!selectedAtoms.length}
            >
              <Undo2 size={15} />
              되돌리기
            </button>
            <button className="segmented-control" type="button" onClick={() => setSelectedAtoms([])}>
              <RotateCcw size={15} />
              초기화
            </button>
          </div>
        </div>

        <div className="canvas-frame lab-canvas">
          <LabScene selectedAtoms={selectedAtoms} molecule={molecule} />
          <AnimatePresence>
            {molecule ? (
              <motion.div
                data-testid="molecule-success"
                className="success-toast"
                initial={{ opacity: 0, y: -12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.96 }}
              >
                You made {molecule.name} ({formatFormula(molecule.formula)})
                <small>{molecule.description}</small>
                <a className="source-link success-source" href={molecule.sourceUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={13} />
                  조합 근거
                </a>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="lab-footer">
          <button className="wide-button compact" type="button" onClick={() => onSelectElement(selectedElement.symbol)}>
            <ArrowLeft size={16} />
            {selectedElement.symbol} 원자 구조 보기
          </button>
          <div className="recipe-hints">
            {["H2O", "CO2", "NH3", "CH4", "NaCl", "HCl", "CO", "SO2", "CH3OH", "C2H5OH"].map((formula) => (
              <span key={formula}>{formula}</span>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}

function formatGeometryLabel(geometry: string): string {
  const labels: Record<string, string> = {
    linear: "선형",
    bent: "굽은형",
    "trigonal-pyramidal": "삼각뿔형",
    "trigonal-planar": "평면삼각형",
    tetrahedral: "정사면체형",
    diatomic: "이원자 분자",
    chain: "사슬형 단순화 모형",
    "ionic-pair": "이온쌍 단순화 모형"
  };

  return labels[geometry] ?? geometry;
}

function formatFormula(formula: string): string {
  const subscript: Record<string, string> = {
    "0": "₀",
    "1": "₁",
    "2": "₂",
    "3": "₃",
    "4": "₄",
    "5": "₅",
    "6": "₆",
    "7": "₇",
    "8": "₈",
    "9": "₉"
  };

  return formula.replace(/\d/g, (digit) => subscript[digit] ?? digit);
}
