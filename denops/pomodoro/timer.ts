interface Timer {
  start(): AsyncIterableIterator<number>;
}

function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createTimer(
  max = 25 * 60 * 1000,
  interval = 1000,
): Timer {
  async function* start() {
    let current = 0;
    while (current < max) {
      await sleep(interval);
      current += interval;
      yield current;
    }
  }

  const timer = {
    start,
  };

  return timer;
}
