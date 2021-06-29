import { ensureNumber, ensureString } from "./deps.ts";
import type { Denops, VariableHelper } from "./deps.ts";
import { MINUTE } from "./util.ts";

const defaultWorkMinutes = 25;
const defaultShortBreakMinutes = 5;
const defaultLongBreakMinutes = 25;
const defaultStepsPerSet = 4;
const defaultWorkSign = "🍅";
const defaultShortBreakSign = "☕";
const defaultLongBreakSign = "😴";
const defaultPauseSign = "⏸️";
const defaultNotificationTitle = "Pomodoro Timer";

export interface Config {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  stepsPerSet: number;
  workSign: string;
  shortBreakSign: string;
  longBreakSign: string;
  pauseSign: string;
  notificationTitle: string;
  reload(): Promise<void>;
}

export async function createVimConfig(
  denops: Denops,
  vars: VariableHelper,
): Promise<Config> {
  async function reload(): Promise<void> {
    const workMinutes = await vars.get(
      denops,
      "pomodoro_work_minutes",
      defaultWorkMinutes,
    );
    const shortBreakMinutes = await vars.get(
      denops,
      "pomodoro_short_break_minutes",
      defaultShortBreakMinutes,
    );
    const longBreakMinutes = await vars.get(
      denops,
      "pomodoro_long_break_minutes",
      defaultLongBreakMinutes,
    );
    const stepsPerSet = await vars.get(
      denops,
      "pomodoro_steps_per_set",
      defaultStepsPerSet,
    );
    const workSign = await vars.get(
      denops,
      "pomodoro_work_sign",
      defaultWorkSign,
    );
    const shortBreakSign = await vars.get(
      denops,
      "pomodoro_short_break_sign",
      defaultShortBreakSign,
    );
    const longBreakSign = await vars.get(
      denops,
      "pomodoro_long_break_sign",
      defaultLongBreakSign,
    );
    const pauseSign = await vars.get(
      denops,
      "pomodoro_pause_sign",
      defaultPauseSign,
    );
    const notificationTitle = await vars.get(
      denops,
      "pomodoro_notification_title",
      defaultNotificationTitle,
    );

    ensureNumber(workMinutes);
    ensureNumber(shortBreakMinutes);
    ensureNumber(longBreakMinutes);
    ensureNumber(stepsPerSet);
    ensureString(workSign);
    ensureString(shortBreakSign);
    ensureString(longBreakSign);
    ensureString(pauseSign);
    ensureString(notificationTitle);

    config.workMinutes = workMinutes * MINUTE;
    config.shortBreakMinutes = shortBreakMinutes * MINUTE;
    config.longBreakMinutes = longBreakMinutes * MINUTE;
    config.stepsPerSet = stepsPerSet;
    config.workSign = workSign;
    config.shortBreakSign = shortBreakSign;
    config.longBreakSign = longBreakSign;
    config.pauseSign = pauseSign;
    config.notificationTitle = notificationTitle;
  }

  const config = {
    reload,
    workMinutes: defaultWorkMinutes * MINUTE,
    shortBreakMinutes: defaultShortBreakMinutes * MINUTE,
    longBreakMinutes: defaultLongBreakMinutes * MINUTE,
    stepsPerSet: defaultStepsPerSet,
    workSign: defaultWorkSign,
    shortBreakSign: defaultShortBreakSign,
    longBreakSign: defaultLongBreakSign,
    pauseSign: defaultPauseSign,
    notificationTitle: defaultNotificationTitle,
  };

  await config.reload();

  return config;
}
