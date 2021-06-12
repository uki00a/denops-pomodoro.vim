import { main } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";
import { Pomodoro } from "./pomodoro.ts";
import { createRenderer } from "./renderer.ts";
import { createTimer } from "./timer.ts";

main(async ({ vim }) => {
  vim.register({
    async notify() {
      const notifier = createNotifier();
      const title = "Test";
      const message = "Hello!";
      await notifier.notify(title, message);
    },
    async start() {
      const timer = createTimer();
      const notifier = createNotifier();
      const renderer = createRenderer(vim);
      const pomodoro = new Pomodoro(timer, notifier, renderer);
      await pomodoro.start();
    },
  });

  await vim.execute([
    `command! DenopsNotify call denops#notify("${vim.name}", "notify", [])`,
    `command! PomodoroStart call denops#notify("${vim.name}", "start", [])`,
  ]);
});
