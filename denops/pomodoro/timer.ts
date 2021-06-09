export interface Timer {
  start(): AsyncIterableIterator<number>;
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createTimer(
  duration = 25 * 60 * 1000,
  interval = 1000,
): Timer {
  async function* start() {
    let remaining = duration;
    while (remaining > 0) {
      yield remaining;
      await sleep(interval);
      remaining -= interval;
    }
  }

  const timer = {
    start,
  };

  return timer;
}
