import { useEffect, useState } from 'react';
import type { Phase, Stats } from '../game/types';
import { totalRounds } from '../game/stats';

interface StatsPanelProps {
  stats: Stats;
  roundId: number;
  phase: Phase;
  onReset: () => void;
}

export function StatsPanel({ stats, roundId, phase, onReset }: StatsPanelProps) {
  const [confirming, setConfirming] = useState(false);
  const rounds = totalRounds(stats);
  const canReset = rounds > 0 || stats.bestStreak > 0;

  useEffect(() => {
    if (!confirming) {
      return undefined;
    }

    const timer = window.setTimeout(() => setConfirming(false), 3_500);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const reset = () => {
    if (!canReset) {
      return;
    }

    if (confirming) {
      onReset();
      setConfirming(false);
      return;
    }

    setConfirming(true);
  };

  const roundLabel =
    phase === 'ready' || roundId === 0 ? '等待开局' : `第 ${String(roundId).padStart(2, '0')} 局`;

  return (
    <aside className="side-panel stats-panel" aria-labelledby="stats-title">
      <div className="side-panel__head">
        <div>
          <span className="panel-eyebrow">LEDGER</span>
          <h2 className="panel-title" id="stats-title">
            战绩
          </h2>
        </div>
        <span className="stats-panel__round">{roundLabel}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-tile stat-tile--win">
          <span className="stat-tile__label">胜</span>
          <strong className="stat-tile__value">{stats.wins}</strong>
          <span className="stat-tile__en">WINS</span>
        </div>
        <div className="stat-tile stat-tile--loss">
          <span className="stat-tile__label">负</span>
          <strong className="stat-tile__value">{stats.losses}</strong>
          <span className="stat-tile__en">LOSSES</span>
        </div>
        <div className="stat-tile stat-tile--push">
          <span className="stat-tile__label">和</span>
          <strong className="stat-tile__value">{stats.pushes}</strong>
          <span className="stat-tile__en">PUSHES</span>
        </div>
      </div>

      <div className="streak-card">
        <div className="streak-card__main">
          <span className="streak-card__label">当前连胜</span>
          <strong>{stats.streak}</strong>
        </div>
        <div className="streak-card__best">
          <span>BEST</span>
          <b>{String(stats.bestStreak).padStart(2, '0')}</b>
        </div>
        <span className="streak-card__spark" aria-hidden="true">
          ✦
        </span>
      </div>

      <p className="stats-panel__note">连胜会被失败或和局打断。战绩保存在本机浏览器。</p>

      <div className="stats-panel__footer">
        <span>共 {rounds} 局</span>
        <button
          type="button"
          className={`text-button${confirming ? ' is-confirming' : ''}`}
          onClick={reset}
          disabled={!canReset}
        >
          {confirming ? '再点一次确认清空' : '清空战绩'}
        </button>
      </div>
    </aside>
  );
}
