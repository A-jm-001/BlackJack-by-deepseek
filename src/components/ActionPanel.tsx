import type { Outcome, Phase } from '../game/types';
import { getOutcomeCopy } from '../ui/labels';

interface ActionPanelProps {
  phase: Phase;
  outcome: Outcome | null;
  canStart: boolean;
  onStart: () => void;
  onHit: () => void;
  onStand: () => void;
}

function PanelHint({ phase, outcome }: { phase: Phase; outcome: Outcome | null }) {
  if (phase === 'ready') {
    return <>一副牌，一场对局。庄家 17 点停牌，软 17 也停牌。</>;
  }

  if (phase === 'dealing') {
    return <>洗牌、切牌、发牌。等两张牌落桌。</>;
  }

  if (phase === 'player-turn') {
    return <>想清楚再落子。超过 21 点就再也没有回头路。</>;
  }

  if (phase === 'dealer-turn') {
    return <>庄家必须补到 17 点或以上。现在只能等。</>;
  }

  const copy = outcome ? getOutcomeCopy(outcome) : null;
  return copy ? <>{copy.title}。{copy.subtitle}。</> : <>本局已经结束。</>;
}

export function ActionPanel({ phase, outcome, canStart, onStart, onHit, onStand }: ActionPanelProps) {
  const active = phase === 'player-turn';
  const done = phase === 'round-over';

  return (
    <aside className="side-panel action-panel" aria-labelledby="action-title">
      <div className="side-panel__head">
        <div>
          <span className="panel-eyebrow">ACTIONS</span>
          <h2 className="panel-title" id="action-title">
            {active ? '轮到你' : done ? '下一局' : '你的行动'}
          </h2>
        </div>
        <span
          className={`turn-light${active ? ' is-on' : ''}${phase === 'dealer-turn' ? ' is-waiting' : ''}`}
          aria-hidden="true"
        />
      </div>

      <p className="action-panel__hint">
        <PanelHint phase={phase} outcome={outcome} />
      </p>

      <div className="action-panel__buttons">
        {(phase === 'ready' || done) && canStart && (
          <button type="button" className="game-button game-button--primary" onClick={onStart}>
            <span className="game-button__copy">
              <strong>{phase === 'ready' ? '开始牌局' : '再来一局'}</strong>
              <small>{phase === 'ready' ? 'DEAL ME IN' : 'NEXT HAND'}</small>
            </span>
            <kbd>Enter</kbd>
          </button>
        )}

        {active && (
          <>
            <button type="button" className="game-button game-button--hit" onClick={onHit}>
              <span className="game-button__glyph" aria-hidden="true">
                +
              </span>
              <span className="game-button__copy">
                <strong>要牌</strong>
                <small>HIT</small>
              </span>
              <kbd>H</kbd>
            </button>
            <button type="button" className="game-button game-button--stand" onClick={onStand}>
              <span className="game-button__glyph" aria-hidden="true">
                ■
              </span>
              <span className="game-button__copy">
                <strong>停牌</strong>
                <small>STAND</small>
              </span>
              <kbd>S</kbd>
            </button>
          </>
        )}

        {(phase === 'dealing' || phase === 'dealer-turn') && (
          <button type="button" className="game-button game-button--pending" disabled>
            <span className="waiting-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="game-button__copy">
              <strong>{phase === 'dealing' ? '发牌中' : '庄家行动中'}</strong>
              <small>{phase === 'dealing' ? 'DEALING' : 'DEALER PLAYING'}</small>
            </span>
          </button>
        )}
      </div>

      <div className="action-panel__shortcuts" aria-label="键盘快捷键">
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

      <div className="action-panel__rule">
        <span>HOUSE RULE</span>
        <p>庄家 16 点及以下必须补牌，17 点及以上停牌。</p>
      </div>
    </aside>
  );
}
