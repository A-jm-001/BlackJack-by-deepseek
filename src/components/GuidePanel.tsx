import type { Outcome, Phase } from '../game/types';
import { getOutcomeCopy } from '../ui/labels';

interface GuidePanelProps {
  phase: Phase;
  outcome: Outcome | null;
}

function PanelHint({ phase, outcome }: { phase: Phase; outcome: Outcome | null }) {
  if (phase === 'ready') {
    return <>按 Enter，或点击牌桌下方的「开始牌局」发牌。</>;
  }

  if (phase === 'dealing') {
    return <>洗牌、切牌、发牌。等两张牌落桌。</>;
  }

  if (phase === 'player-turn') {
    return <>要牌追分，或停牌把回合交给庄家。超过 21 点就输了。</>;
  }

  if (phase === 'dealer-turn') {
    return <>庄家必须补到 17 点或以上。现在只能等。</>;
  }

  const copy = outcome ? getOutcomeCopy(outcome) : null;
  return copy ? <>{copy.title}。{copy.subtitle}。</> : <>本局已经结束。</>;
}

export function GuidePanel({ phase, outcome }: GuidePanelProps) {
  const active = phase === 'player-turn';

  return (
    <aside className="side-panel guide-panel" aria-labelledby="guide-title">
      <div className="side-panel__head">
        <div>
          <span className="panel-eyebrow">TABLE NOTES</span>
          <h2 className="panel-title" id="guide-title">
            牌桌提示
          </h2>
        </div>
        <span
          className={`turn-light${active ? ' is-on' : ''}${phase === 'dealer-turn' ? ' is-waiting' : ''}`}
          aria-hidden="true"
        />
      </div>

      <p className="guide-panel__hint">
        <PanelHint phase={phase} outcome={outcome} />
      </p>

      <div className="guide-panel__policy">
        <span className="guide-panel__policy-title">HOUSE RULE</span>
        <div className="guide-panel__policy-row">
          <div>
            <strong>≤ 16</strong>
            <small>必须补牌</small>
          </div>
          <i aria-hidden="true">/</i>
          <div>
            <strong>≥ 17</strong>
            <small>必须停牌</small>
          </div>
        </div>
        <p>软 17 同样停牌，庄家不做自由选择。</p>
      </div>

      <div className="guide-panel__shortcuts" aria-label="键盘快捷键">
        <span>
          <kbd>H</kbd> 要牌
        </span>
        <span>
          <kbd>S</kbd> 停牌
        </span>
        <span>
          <kbd>Enter</kbd> 开局
        </span>
      </div>

      <div className="guide-panel__foot">
        <span>HEADS UP</span>
        <p>单人对庄，一副牌每局重洗。</p>
      </div>
    </aside>
  );
}
