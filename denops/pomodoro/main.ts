import type { Denops } from "./deps.ts";
import { deferred } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";
import { Pomodoro } from "./pomodoro.ts";
import { createRenderer } from "./renderer.ts";
import { createTimer } from "./timer.ts";
import { createVimConfig } from "./config.ts";
import { createVim } from "./vim.ts";
import type { Vim } from "./vim.ts";

export async function main(denops: Denops): Promise<void> {
  const vim = createVim(denops);
  let pomodoro: Pomodoro | null = null;
  let disposed = deferred<void>();

  vim.register({
    async start(): Promise<void> {
      if (pomodoro) {
        pomodoro.pause();
      }
      pomodoro = await createPomodoro(vim);
      do {
        await Promise.any([
          pomodoro.start(),
          disposed,
        ]);
      } while (!pomodoro.isPaused());
    },
    async pause(): Promise<void> {
      if (pomodoro) {
        await pomodoro.pause();
      }
    },
    async resume(): Promise<void> {
      if (pomodoro) {
        await pomodoro.resume();
      }
    },
    async reset(): Promise<void> {
      if (pomodoro) {
        await pomodoro.reset();
        disposed.resolve();
        disposed = deferred<void>();
      }
    },
    async echo(): Promise<void> {
      await vim.execute(`echo g:pomodoro_timer_status`);
    },
  });

  await vim.execute([
    `command! PomodoroStart call denops#notify("${vim.name}", "start", [])`,
    `command! PomodoroPause call denops#notify("${vim.name}", "pause", [])`,
    `command! PomodoroResume call denops#notify("${vim.name}", "resume", [])`,
    `command! PomodoroReset call denops#notify("${vim.name}", "reset", [])`,
    `command! PomodoroEcho call denops#notify("${vim.name}", "echo", [])`,
  ]);
}

async function createPomodoro(vim: Vim): Promise<Pomodoro> {
  const config = await createVimConfig(vim);
  const timer = createTimer(config.workMinutes);
  const notifier = createNotifier();
  const renderer = createRenderer(vim);
  return new Pomodoro(config, timer, notifier, renderer);
}
