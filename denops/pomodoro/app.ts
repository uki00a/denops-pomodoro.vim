import { main } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";
import { Pomodoro } from "./pomodoro.ts";
import { createRenderer } from "./renderer.ts";
import { createTimer } from "./timer.ts";

main(async ({ vim }) => {
  let pomodoro: Pomodoro | null = null;
  vim.register({
    async notify() {
      const notifier = createNotifier();
      const title = "Test";
      const message = "Hello!";
      await notifier.notify(title, message);
    },
    async start() {
      if (pomodoro) {
        pomodoro.stop();
      }
      const timer = createTimer();
      const notifier = createNotifier();
      const renderer = createRenderer(vim);
      pomodoro = new Pomodoro(timer, notifier, renderer);
      await pomodoro.start();
    },
    stop() {
      if (pomodoro) {
        pomodoro.stop();
      }
    },
    resume() {
      if (pomodoro) {
        pomodoro.resume();
      }
    },
  });

  await vim.execute([
    `command! DenopsNotify call denops#notify("${vim.name}", "notify", [])`,
    `command! PomodoroStart call denops#notify("${vim.name}", "start", [])`,
    `command! PomodoroStop call denops#notify("${vim.name}", "stop", [])`,
    `command! PomodoroResume call denops#notify("${vim.name}", "resume", [])`,
  ]);
});
