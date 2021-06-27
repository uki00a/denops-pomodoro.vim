import { Pomodoro } from "../denops/pomodoro/pomodoro.ts";
import { createTimer } from "../denops/pomodoro/timer.ts";
import { Notifier } from "../denops/pomodoro/notifiers.ts";
import { Renderer } from "../denops/pomodoro/renderer.ts";
import { assertEquals, td } from "./deps.ts";

Deno.test("Pomodoro#start", async () => {
  const config = Object.freeze({
    workMinutes: 3000, // 3 seconds
    shortBreakMinutes: 2000, // 2 seconds
    longBreakMinutes: 4000, // 4 seconds
    stepsPerSet: 2,
    workSign: "W",
    shortBreakSign: "S",
    longBreakSign: "L",
    pauseSign: "P",
    reload: () => Promise.resolve(), // NOOP
  });
  const timer = createTimer(3000, 1000);
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);

  await pomodoro.start();

  td.verify(notifier.notify("Work", "DONE"), { times: 2 });
  {
    const { calls } = td.explain(renderer.render);
    const argsList = calls.map((x) => x.args);
    assertEquals(argsList, [
      ["W", 3000],
      ["W", 2000],
      ["W", 1000],
      ["S", 2000],
      ["S", 1000],
      ["W", 3000],
      ["W", 2000],
      ["W", 1000],
      ["S", 2000],
      ["S", 1000],
      ["L", 4000],
      ["L", 3000],
      ["L", 2000],
      ["L", 1000],
    ]);
  }
});
