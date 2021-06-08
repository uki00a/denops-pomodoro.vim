import { createTimer } from "../denops/pomodoro/timer.ts";
import { assertEquals } from "./deps.ts";

Deno.test("Timer", async () => {
  const timer = createTimer(5000, 1000);
  const results = [] as number[];
  for await (const tick of timer.start()) {
    results.push(tick);
  }
  assertEquals(results, [1000, 2000, 3000, 4000, 5000]);
});
