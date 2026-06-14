import { motion } from "framer-motion";
import { ArrowRight, Atom, BookOpen, CircleDot, FlaskConical, Sparkles, Table2 } from "lucide-react";
import { AtomScene } from "./AtomScene";
import type { ElementRecord } from "../data/elements";

type DashboardProps = {
  element: ElementRecord;
  elements: ElementRecord[];
  language: "ko" | "en";
  showOrbitalCloud: boolean;
  quizFocus: boolean;
  onOpenPeriodicTable: () => void;
  onStartExperiment: () => void;
  onToggleOrbitalCloud: () => void;
  onSelectElement: (symbol: string) => void;
};

export function Dashboard({
  element,
  elements,
  language,
  showOrbitalCloud,
  quizFocus,
  onOpenPeriodicTable,
  onStartExperiment,
  onToggleOrbitalCloud,
  onSelectElement
}: DashboardProps) {
  const localizedName = language === "ko" ? element.koreanName : element.name;
  const radiusScale = Math.min(100, Math.max(6, element.radiusScale));
  const discoveredByLabel =
    element.discoveredBy === "PubChem source record" ? "기초 원소 데이터" : element.discoveredBy;
  const discoveryNote =
    element.discoveredBy === "PubChem source record" ? "발견자 세부 기록은 별도 검증 필요" : "발견 및 분리 기록";

  return (
    <section className="dashboard-grid">
      <aside className="side-panel left-panel">
        <div className="panel-kicker">
          <CircleDot size={14} />
          Selected Element
        </div>

        <div className="element-identity">
          <div className="element-badge" style={{ borderColor: element.color, color: element.color }}>
            {element.symbol}
          </div>
          <div className="min-w-0">
            <h1>{localizedName}</h1>
            <p>{element.name}</p>
          </div>
        </div>

        <dl className="metric-grid">
          <div>
            <dt>원자 번호</dt>
            <dd>{element.atomicNumber}</dd>
          </div>
          <div>
            <dt>원자량</dt>
            <dd>{element.atomicMass}</dd>
          </div>
          <div>
            <dt>반지름</dt>
            <dd>
              {element.radiusPm} pm{element.radiusEstimated ? " 추정" : ""}
            </dd>
          </div>
          <div>
            <dt>전자 껍질</dt>
            <dd>{element.shells.join("-")}</dd>
          </div>
          <div>
            <dt>표준 상태</dt>
            <dd>{element.standardState.replace("Expected to be a ", "")}</dd>
          </div>
          <div>
            <dt>계열</dt>
            <dd>{element.groupBlock}</dd>
          </div>
        </dl>

        <div className="info-block">
          <h2>Element Brief</h2>
          <p>{element.summary}</p>
        </div>

        <div className="donut-row">
          <div
            className="donut-chart"
            style={{
              background: `conic-gradient(${element.color} ${radiusScale * 3.6}deg, rgba(148, 163, 184, 0.18) 0deg)`
            }}
            aria-label={`Atomic radius scale ${radiusScale}%`}
          >
            <span>{radiusScale}%</span>
          </div>
          <div>
            <h2>원자 반지름 스케일</h2>
            <p>
              {element.radiusEstimated
                ? "실측 반지름이 부족한 초중원소는 3D 비교용 추정값으로 표시합니다."
                : "원자 반지름 값을 3D 모델 비교용 상대 스케일로 표시합니다."}
            </p>
          </div>
        </div>

        <button className="wide-button" type="button" onClick={onOpenPeriodicTable}>
          <Table2 size={17} />
          주기율표에서 원소 선택
          <ArrowRight size={16} />
        </button>
      </aside>

      <section className="atom-stage">
        <div className="stage-header">
          <div>
            <span className="panel-kicker">
              <Atom size={14} />
              3D Learning Model
            </span>
            <h2>
              {element.symbol} Bohr-style Shell Diagram
              <span>
                mass #{element.massNumber}: {element.atomicNumber}p / {element.neutrons}n /{" "}
                {element.atomicNumber}e
              </span>
            </h2>
          </div>

          <div className="stage-controls">
            <button
              className={showOrbitalCloud ? "segmented-control active" : "segmented-control"}
              type="button"
              onClick={onToggleOrbitalCloud}
            >
              <Sparkles size={15} />
              전자 구름
            </button>
            <button className="segmented-control" type="button" onClick={onOpenPeriodicTable}>
              <Table2 size={15} />
              원소 변경
            </button>
          </div>
        </div>

        <motion.div
          data-testid="atom-canvas-frame"
          className="canvas-frame"
          key={element.symbol}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.28 }}
        >
          <AtomScene element={element} showOrbitalCloud={showOrbitalCloud} />
        </motion.div>

        <div className="element-strip" aria-label="Quick element selector">
          {elements.slice(0, 11).map((item) => (
            <button
              key={item.symbol}
              data-testid={`quick-element-${item.symbol}`}
              className={item.symbol === element.symbol ? "strip-item selected" : "strip-item"}
              type="button"
              onClick={() => onSelectElement(item.symbol)}
              style={{ "--element-color": item.color } as React.CSSProperties}
            >
              <span>{item.symbol}</span>
              <small>{item.atomicNumber}</small>
            </button>
          ))}
        </div>
      </section>

      <aside className="side-panel right-panel">
        <div className="panel-kicker">
          <BookOpen size={14} />
          Discovery Timeline
        </div>

        <ol className="timeline">
          <li>
            <time>{element.discoveryYear}</time>
            <strong>{discoveredByLabel}</strong>
            <span>{discoveryNote}</span>
          </li>
          <li>
            <time>Atomic #{element.atomicNumber}</time>
            <strong>전자껍질 {element.shells.join(", ")}</strong>
            <span>{element.electronConfiguration}</span>
          </li>
          <li>
            <time>{element.groupBlock}</time>
            <strong>반응성 관찰</strong>
            <span>실험실에서 다른 원소와 결합해 분자를 만들어 볼 수 있음</span>
          </li>
        </ol>

        <div className={quizFocus ? "challenge-card focused" : "challenge-card"}>
          <div>
            <span className="panel-kicker">
              <FlaskConical size={14} />
              Challenge
            </span>
            <h2>{quizFocus ? "퀴즈 모드" : "오늘의 실험"}</h2>
            <p>
              {quizFocus
                ? `${localizedName}의 양성자 수와 전자 배치를 보고 정답을 고르세요.`
                : "수소 두 개와 산소 하나를 결합해 물 분자 구조를 완성해 보세요."}
            </p>
          </div>
          <button
            className="wide-button compact"
            data-testid="start-today-experiment"
            type="button"
            onClick={onStartExperiment}
          >
            시작하기
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="uses-list">
          <h2>대표 활용</h2>
          {element.uses.map((use) => (
            <span key={use}>{use}</span>
          ))}
        </div>
      </aside>
    </section>
  );
}
