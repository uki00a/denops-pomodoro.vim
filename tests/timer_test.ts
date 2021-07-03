import { createTimer } from "../denops/pomodoro/timer.ts";
import { assert, assertEquals } from "./deps.ts";

Deno.test("Timer.start", async () => {
  const timer = createTimer(5000, 1000);
  const results = [] as number[];
  for await (const remaining of timer.start()) {
    results.push(remaining);
  }
  assertEquals(results, [5000, 4000, 3000, 2000, 1000]);
});

Deno.test("Timer.start: call multiple times", async () => {
  const timer = createTimer();
  const results = [] as number[];
  for await (const remaining of timer.start(2000)) {
    results.push(remaining);
  }
  for await (const remaining of timer.start(3000)) {
    results.push(remaining);
  }
  assertEquals(results, [2000, 1000, 3000, 2000, 1000]);
});

Deno.test("Timer.resume & pause", async () => {
  const startedAt = new Date();
  const duration = 3000;
  const interval = 1000;
  const timer = createTimer(duration, interval);
  const results = [] as number[];
  const snapshot = [] as number[][];
  const done = (async () => {
    for await (const remaining of timer.start()) {
      results.push(remaining);
    }
  })();
  setTimeout(() => {
    timer.pause();
    setTimeout(() => {
      snapshot.push([...results]);
      timer.resume();
    }, 6000);
  }, 1000);
  await done;
  const elapsed = new Date().valueOf() - startedAt.valueOf();
  assertEquals(results, [3000, 2000, 1000]);
  assertEquals(snapshot, [[3000]]);
  assert(elapsed >= 10_000, `${elapsed} should be greater than 10000`);
});

Deno.test("Timer.remaining", async () => {
  const duration = 5000;
  const interval = 1000;
  const timer = createTimer(duration, interval);
  assertEquals(timer.remaining(), duration);
  const iter = timer.start();
  await iter.next();
  timer.pause();
  assertEquals(timer.remaining(), duration - interval);
});
