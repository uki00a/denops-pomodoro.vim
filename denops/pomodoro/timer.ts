import { deferred } from "./deps.ts";

export interface Timer {
  start(): AsyncIterableIterator<number>;
  stop(): void;
  resume(): void;
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
  let remaining = duration;
  let currentPromise = deferred<IteratorResult>();
  let isStarted = false;

  function timerCallback(): void {
    if (remaining > 0) {
      currentPromise.resolve({ value: remaining, done: false });
      remaining -= interval;
      currentPromise = deferred<IteratorResult>();
    } else {
      isStarted = false;
      stop();
      currentPromise.resolve({ done: true, value: remaining });
    }
  }

  function start() {
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

  function stop(): void {
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
    stop,
    resume,
  };

  return timer;
}
