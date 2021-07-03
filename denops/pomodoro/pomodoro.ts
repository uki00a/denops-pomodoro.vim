import type { Timer } from "./timer.ts";
import type { Notifier } from "./notifiers.ts";
import type { Renderer } from "./renderer.ts";
import type { Config } from "./config.ts";

type Round =
  | "work"
  | "short-break"
  | "long-break"
  | "pause"
  | "done";

export class Pomodoro {
  #config: Config;
  #timer: Timer;
  #notifier: Notifier;
  #renderer: Renderer;
  #round: Round;
  #roundBeforeStop?: Round;

  constructor(
    config: Config,
    timer: Timer,
    notifier: Notifier,
    renderer: Renderer,
  ) {
    this.#config = config;
    this.#timer = timer;
    this.#notifier = notifier;
    this.#renderer = renderer;
    this.#round = "pause";
  }

  async start(): Promise<void> {
    for (let i = 0; i < this.#config.stepsPerSet; i++) {
      if (i > 0) {
        await this.#notify(`It's time to work!${this.#config.workSign}`);
      }
      await this.#startWork();
      await this.#notify(
        `It's time to take a short break!${this.#config.shortBreakSign}`,
      );
      await this.#startShortBreak();
    }
    await this.#notify(
      `It's time to take a long break!${this.#config.longBreakSign}`,
    );
    await this.#startLongBreak();
    this.#round = "done";
  }

  pause(): Promise<void> {
    this.#roundBeforeStop = this.#round;
    this.#round = "pause";
    this.#timer.pause();
    return this.#renderCurrentState(this.#timer.remaining());
  }

  resume(): Promise<void> {
    if (this.#roundBeforeStop) {
      this.#round = this.#roundBeforeStop;
      this.#roundBeforeStop = undefined;
    }
    this.#timer.resume();
    return this.#renderCurrentState(this.#timer.remaining());
  }

  reset(): Promise<void> {
    this.#timer.pause();
    this.#round = "pause";
    return this.#renderCurrentState(this.#config.workMinutes);
  }

  isStopped(): boolean {
    return this.#round === "pause";
  }

  #startWork(): Promise<void> {
    return this.#startRound("work", this.#config.workMinutes);
  }

  #startShortBreak(): Promise<void> {
    return this.#startRound("short-break", this.#config.shortBreakMinutes);
  }

  #startLongBreak(): Promise<void> {
    return this.#startRound("long-break", this.#config.longBreakMinutes);
  }

  async #startRound(round: Round, minutes: number): Promise<void> {
    this.#round = round;
    for await (
      const remaining of this.#timer.start(minutes)
    ) {
      this.#renderCurrentState(remaining);
    }
  }

  #renderCurrentState(remaining: number): Promise<void> {
    const sign = this.#signForCurrentRound();
    return this.#renderer.render(sign, remaining);
  }

  #signForCurrentRound(): string {
    switch (this.#round) {
      case "work":
        return this.#config.workSign;
      case "short-break":
        return this.#config.shortBreakSign;
      case "long-break":
        return this.#config.longBreakSign;
      case "pause":
      case "done":
        return this.#config.pauseSign;
    }
  }

  #notify(message: string): Promise<void> {
    return this.#notifier.notify(
      this.#config.notificationTitle,
      message,
    );
  }
}
