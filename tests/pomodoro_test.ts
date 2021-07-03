import { Pomodoro } from "../denops/pomodoro/pomodoro.ts";
import { createTimer } from "../denops/pomodoro/timer.ts";
import { Notifier } from "../denops/pomodoro/notifiers.ts";
import { Renderer } from "../denops/pomodoro/renderer.ts";
import type { Config } from "../denops/pomodoro/config.ts";
import { assert, assertEquals, delay, td } from "./deps.ts";

Deno.test("Pomodoro#start", async () => {
  const config = createConfig();
  const timer = createTimer();
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);

  await pomodoro.start();

  assert(!pomodoro.isPaused());
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
      [config.workSign, 0],
      [config.shortBreakSign, 2000],
      [config.shortBreakSign, 1000],
      [config.shortBreakSign, 0],
      [config.workSign, 3000],
      [config.workSign, 2000],
      [config.workSign, 1000],
      [config.workSign, 0],
      [config.shortBreakSign, 2000],
      [config.shortBreakSign, 1000],
      [config.shortBreakSign, 0],
      [config.longBreakSign, 4000],
      [config.longBreakSign, 3000],
      [config.longBreakSign, 2000],
      [config.longBreakSign, 1000],
      [config.longBreakSign, 0],
    ]);
  }
});

Deno.test("Pomodoro#pause", async () => {
  const config = createConfig();
  const timer = createTimer();
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);
  pomodoro.start();
  await delay(1000);
  await pomodoro.pause();
  assert(pomodoro.isPaused());

  const remaining = timer.remaining();
  const lastCall = last(td.explain(renderer.render).calls);
  await delay(1000);
  assertEquals(remaining, timer.remaining());
  assertEquals(lastCall.args, [config.pauseSign, remaining]);
});

Deno.test("Pomodoro#reset", async () => {
  const config = createConfig();
  const timer = createTimer();
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);
  pomodoro.start();
  await delay(1000);
  await pomodoro.reset();

  const lastCall = last(td.explain(renderer.render).calls);
  assert(pomodoro.isPaused());
  assertEquals(lastCall.args, [config.pauseSign, config.workMinutes]);
});

Deno.test("Pomodoro#resume", async () => {
  const config = createConfig();
  const timer = createTimer();
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(config, timer, notifier, renderer);
  pomodoro.start();
  await delay(1000);
  await pomodoro.pause();
  const remaining = timer.remaining();
  await pomodoro.resume();
  await delay(1000);
  try {
    const lastCall = last(td.explain(renderer.render).calls);
    assert(!pomodoro.isPaused());
    assert(timer.remaining() < remaining);
    assertEquals(lastCall.args[0], config.workSign);
  } finally {
    await pomodoro.pause();
  }
});

function createConfig(override: Partial<Config> = {}): Config {
  return Object.freeze({
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
    ...override,
  });
}

function last<T>(array: Array<T>): T {
  return array[array.length - 1];
}
