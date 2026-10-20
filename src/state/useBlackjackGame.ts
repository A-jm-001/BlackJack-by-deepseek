import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { dealerShouldHit } from '../game/dealer';
import { createDeck, shuffleDeck } from '../game/deck';
import { getHandValue } from '../game/hand';
import { createInitialState, gameReducer } from '../game/reducer';
import type { Outcome, Settings } from '../game/types';
import { useSound, type SoundName } from '../hooks/useSound';
import { loadSettings, loadStats, saveSettings, saveStats } from './storage';

export const DEALING_DURATION_MS = 1_050;
export const DEALER_STEP_DURATION_MS = 680;

function outcomeSound(outcome: Outcome): SoundName {
  switch (outcome) {
    case 'player-blackjack':
      return 'blackjack';
    case 'player-bust':
      return 'bust';
    case 'dealer-blackjack':
    case 'dealer-win':
      return 'lose';
    case 'dealer-bust':
    case 'player-win':
      return 'win';
    case 'push':
      return 'push';
  }
}

export function useBlackjackGame() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    () => createInitialState(loadStats()),
  );
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const { play } = useSound(settings.muted);
  const lastResultSoundRound = useRef(0);

  useEffect(() => {
    saveStats(state.stats);
  }, [state.stats]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    if (state.phase !== 'dealing') {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      dispatch({ type: 'DEAL_COMPLETE' });
    }, DEALING_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.phase, state.roundId]);

  useEffect(() => {
    if (state.phase !== 'dealer-turn') {
      return undefined;
    }

    const dealerValue = getHandValue(state.dealerCards);
    const timer = window.setTimeout(() => {
      if (dealerShouldHit(dealerValue)) {
        play('deal');
        dispatch({ type: 'DEALER_DRAW' });
      } else {
        dispatch({ type: 'FINISH_ROUND' });
      }
    }, DEALER_STEP_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [state.phase, state.roundId, state.dealerCards, play]);

  useEffect(() => {
    if (state.phase !== 'round-over' || state.outcome === null) {
      return;
    }

    if (lastResultSoundRound.current === state.roundId) {
      return;
    }

    lastResultSoundRound.current = state.roundId;
    play(outcomeSound(state.outcome));
  }, [state.phase, state.roundId, state.outcome, play]);

  const startRound = useCallback(() => {
    if (state.phase !== 'ready' && state.phase !== 'round-over') {
      return;
    }

    play('start');
    dispatch({
      type: 'START_ROUND',
      deck: shuffleDeck(createDeck()),
    });
  }, [state.phase, play]);

  const hit = useCallback(() => {
    if (state.phase !== 'player-turn') {
      return;
    }

    play('deal');
    dispatch({ type: 'HIT' });
  }, [state.phase, play]);

  const stand = useCallback(() => {
    if (state.phase !== 'player-turn') {
      return;
    }

    play('flip');
    dispatch({ type: 'STAND' });
  }, [state.phase, play]);

  const resetStats = useCallback(() => {
    dispatch({ type: 'RESET_STATS' });
  }, []);

  const toggleMuted = useCallback(() => {
    setSettings((current) => ({ ...current, muted: !current.muted }));
  }, []);

  const playerValue = getHandValue(state.playerCards);
  const dealerValue = getHandValue(state.dealerCards);
  const canStart = state.phase === 'ready' || state.phase === 'round-over';

  return {
    state,
    playerValue,
    dealerValue,
    canStart,
    muted: settings.muted,
    startRound,
    hit,
    stand,
    resetStats,
    toggleMuted,
  };
}
