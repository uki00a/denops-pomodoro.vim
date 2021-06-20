import { deferred } from "./deps.ts";

export interface Timer {
  start(): AsyncIterableIterator<number>;
  stop(): void;
}

interface IteratorResult {
  done: boolean;
  value: number;
}

export function createTimer(
  duration = 25 * 60 * 1000,
  interval = 1000,
): Timer {
  let timerID: number | null = null;
  function start() {
    let remaining = duration;
    let currentPromise = deferred<IteratorResult>();

    timerID = setInterval(() => {
      if (remaining > 0) {
        currentPromise.resolve({ value: remaining, done: false });
        remaining -= interval;
        currentPromise = deferred<IteratorResult>();
      } else {
        stop();
        currentPromise.resolve({ done: true, value: remaining });
      }
    }, interval);

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

  function stop(): void {
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    }
  }

  const timer = {
    start,
    stop,
  };

  return timer;
}
