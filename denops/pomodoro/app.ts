import { main } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";
import { Pomodoro } from "./pomodoro.ts";
import { createRenderer } from "./renderer.ts";
import { createTimer } from "./timer.ts";
import { createVimConfig } from "./config.ts";
import { MINUTE } from "./util.ts";

main(async ({ vim }) => {
  let pomodoro: Pomodoro | null = null;
  vim.register({
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
      const config = await createVimConfig(vim);
      const timer = createTimer(
        config.workMinutes * MINUTE,
        config.shortBreakMinutes * MINUTE,
      );
      const notifier = createNotifier();
      const renderer = createRenderer(vim);
      pomodoro = new Pomodoro(timer, notifier, renderer);
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
  });

  await vim.execute([
    `command! DenopsNotify call denops#notify("${vim.name}", "notify", [])`,
    `command! PomodoroStart call denops#notify("${vim.name}", "start", [])`,
    `command! PomodoroStop call denops#notify("${vim.name}", "stop", [])`,
    `command! PomodoroResume call denops#notify("${vim.name}", "resume", [])`,
  ]);
});
