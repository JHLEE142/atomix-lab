import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ElementRecord } from "../data/elements";

type PeriodicTableOverlayProps = {
  elements: ElementRecord[];
  language: "ko" | "en";
  open: boolean;
  selectedSymbol: string;
  onClose: () => void;
  onSelect: (symbol: string) => void;
};

export function PeriodicTableOverlay({
  elements,
  language,
  open,
  selectedSymbol,
  onClose,
  onSelect
}: PeriodicTableOverlayProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="periodic-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="periodic-panel"
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.2 }}
          >
            <div className="periodic-header">
              <div>
                <span className="panel-kicker">Periodic Table</span>
                <h2>원소 선택</h2>
              </div>
              <button className="icon-button" type="button" onClick={onClose} title="닫기">
                <X size={18} />
              </button>
            </div>

            <div className="periodic-scroll">
              <div className="periodic-grid">
                {elements.map((element) => (
                  <button
                    key={element.symbol}
                    data-testid={`periodic-${element.symbol}`}
                    className={element.symbol === selectedSymbol ? "periodic-cell selected" : "periodic-cell"}
                    type="button"
                    onClick={() => onSelect(element.symbol)}
                    style={
                      {
                        gridColumn: element.group,
                        gridRow: element.period,
                        "--element-color": element.color
                      } as React.CSSProperties
                    }
                  >
                    <small>{element.atomicNumber}</small>
                    <strong>{element.symbol}</strong>
                    <span>{language === "ko" ? element.koreanName : element.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
