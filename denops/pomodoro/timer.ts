import { deferred } from "./deps.ts";

export interface Timer {
  start(duration?: number): AsyncIterableIterator<number>;
  pause(): void;
  resume(): void;
  remaining(): number;
}

interface IteratorResult {
  done: boolean;
  value: number;
}

export function createTimer(
  initialDuration = 25 * 60 * 1000,
  interval = 1000,
): Timer {
  let timerID: number | null = null;
  let remaining = initialDuration;
  let currentPromise = deferred<IteratorResult>();
  let isStarted = false;

  function timerCallback(): void {
    if (remaining > 0) {
      currentPromise.resolve({ value: remaining, done: false });
      remaining -= interval;
      currentPromise = deferred<IteratorResult>();
    } else {
      isStarted = false;
      pause();
      currentPromise.resolve({ done: true, value: remaining });
      currentPromise = deferred<IteratorResult>();
    }
  }

  function start(duration: number = initialDuration) {
    if (timerID) {
      clearInterval(timerID);
    }
    isStarted = true;
    remaining = duration;
    timerID = setInterval(timerCallback, interval);

    const iter = {
      [Symbol.asyncIterator]() {
        return iter;
      },
      next() {
        return currentPromise;
      },
    };

    return iter;
  }

  function pause(): void {
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    }
  }

  function resume(): void {
    if (isStarted) {
      timerID = setInterval(timerCallback, interval);
    }
  }

  const timer = {
    start,
    pause,
    resume,
    remaining(): number {
      return remaining;
    },
  };

  return timer;
}
