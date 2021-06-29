import type { Denops } from "./deps.ts";
import { execute, vars } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";
import { Pomodoro } from "./pomodoro.ts";
import { createRenderer } from "./renderer.ts";
import { createTimer } from "./timer.ts";
import { createVimConfig } from "./config.ts";

export async function main(denops: Denops): Promise<void> {
  let pomodoro: Pomodoro | null = null;

  denops.dispatcher = {
    async notify(): Promise<void> {
      const notifier = createNotifier();
      const title = "Test";
      const message = "Hello!";
      await notifier.notify(title, message);
    },
    async start(): Promise<void> {
      if (pomodoro) {
        pomodoro.stop();
      }
      const config = await createVimConfig(denops, vars.g);
      const timer = createTimer(config.workMinutes);
      const notifier = createNotifier();
      const renderer = createRenderer(denops, vars.g);
      pomodoro = new Pomodoro(config, timer, notifier, renderer);
      await pomodoro.start();
    },
    stop(): Promise<void> {
      if (pomodoro) {
        pomodoro.stop();
      }
      return Promise.resolve();
    },
    resume(): Promise<void> {
      if (pomodoro) {
        pomodoro.resume();
      }
      return Promise.resolve();
    },
  };

  await execute(denops, [
    `command! DenopsNotify call denops#notify("${denops.name}", "notify", [])`,
    `command! PomodoroStart call denops#notify("${denops.name}", "start", [])`,
    `command! PomodoroStop call denops#notify("${denops.name}", "stop", [])`,
    `command! PomodoroResume call denops#notify("${denops.name}", "resume", [])`,
  ]);
}
