import { ensureNumber } from "./deps.ts";
import type { Vim } from "./deps.ts";

const defaultWorkMinutes = 25;
const defaultShortBreakMinutes = 5;
const defaultLongBreakMinutes = 25;

export interface Config {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  reload(): Promise<void>;
}

export async function createVimConfig(vim: Vim): Promise<Config> {
  async function reload(): Promise<void> {
    const workMinutes = await vim.g.get(
      "pomodoro_work_minutes",
      defaultWorkMinutes,
    );
    const shortBreakMinutes = await vim.g.get(
      "pomodoro_short_break_minutes",
      defaultShortBreakMinutes,
    );
    const longBreakMinutes = await vim.g.get(
      "pomodoro_long_break_minutes",
      defaultLongBreakMinutes,
    );

    ensureNumber(workMinutes);
    ensureNumber(shortBreakMinutes);
    ensureNumber(longBreakMinutes);

    config.workMinutes = workMinutes;
    config.shortBreakMinutes = shortBreakMinutes;
    config.longBreakMinutes = longBreakMinutes;
  }

  const config = {
    reload,
    workMinutes: defaultWorkMinutes,
    shortBreakMinutes: defaultShortBreakMinutes,
    longBreakMinutes: defaultLongBreakMinutes,
  };

  await config.reload();

  return config;
}
