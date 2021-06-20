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

Deno.test("Timer.resume & stop", async () => {
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
    timer.stop();
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
