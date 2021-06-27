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
    notificationTitle: "Pomodoro Timer",
    reload: () => Promise.resolve(), // NOOP
  });
  const timer = createTimer(3000, 1000);
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);

  await pomodoro.start();

  {
    const { calls } = td.explain(notifier.notify);
    const argsList = calls.map((x) => x.args);
    const shortBreakMessage =
      `It's time to take a short break!${config.shortBreakSign}`;
    const longBreakMessage =
      `It's time to take a long break!${config.longBreakSign}`;
    const workMessage = `It's time to work!${config.workSign}`;
    assertEquals(argsList, [
      [config.notificationTitle, shortBreakMessage],
      [config.notificationTitle, workMessage],
      [config.notificationTitle, shortBreakMessage],
      [config.notificationTitle, longBreakMessage],
    ]);
  }

  {
    const { calls } = td.explain(renderer.render);
    const argsList = calls.map((x) => x.args);
    assertEquals(argsList, [
      [config.workSign, 3000],
      [config.workSign, 2000],
      [config.workSign, 1000],
      [config.shortBreakSign, 2000],
      [config.shortBreakSign, 1000],
      [config.workSign, 3000],
      [config.workSign, 2000],
      [config.workSign, 1000],
      [config.shortBreakSign, 2000],
      [config.shortBreakSign, 1000],
      [config.longBreakSign, 4000],
      [config.longBreakSign, 3000],
      [config.longBreakSign, 2000],
      [config.longBreakSign, 1000],
    ]);
  }
});
