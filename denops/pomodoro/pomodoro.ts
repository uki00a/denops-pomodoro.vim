import type { Timer } from "./timer.ts";
import type { Notifier } from "./notifiers.ts";
import type { Renderer } from "./renderer.ts";
import type { Config } from "./config.ts";
import { MINUTE } from "./util.ts";

type Round = "work" | "short-break" | "long-break" | "pause";

export class Pomodoro {
  #config: Config;
  #timer: Timer;
  #notifier: Notifier;
  #renderer: Renderer;
  #round: Round;

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
      await this.#runStep();
    }
    await this.#startLongBreak();
  }

  stop(): void {
    this.#round = "pause";
    this.#timer.stop();
    this.#renderCurrentState(this.#timer.remaining());
  }

  resume(): void {
    this.#timer.resume();
  }

  async #runStep(): Promise<void> {
    await this.#startWork();
    await this.#startShortBreak();
  }

  async #startWork(): Promise<void> {
    this.#round = "work";
    for await (const remaining of this.#timer.start(this.#config.workMinutes * MINUTE)) {
      this.#renderCurrentState(remaining);
    }
    await this.#notifier.notify("Work", "DONE");
  }

  async #startShortBreak(): Promise<void> {
    this.#round = "short-break";
    for await (const remaining of this.#timer.start(this.#config.shortBreakMinutes * MINUTE)) {
      this.#renderCurrentState(remaining);
    }
    await this.#notifier.notify("Short break", "DONE");
  }

  async #startLongBreak(): Promise<void> {
    this.#round = "long-break";
    for await (const remaining of this.#timer.start(this.#config.longBreakMinutes * MINUTE)) {
      this.#renderCurrentState(remaining);
    }
    await this.#notifier.notify("Long break", "DONE");
  }

  #renderCurrentState(remaining: number): void {
    const sign = this.#signForCurrentRound();
    this.#renderer.render(sign, remaining);
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
        return this.#config.pauseSign;
    }
  }
}
