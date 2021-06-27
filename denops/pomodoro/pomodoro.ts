import type { Timer } from "./timer.ts";
import type { Notifier } from "./notifiers.ts";
import type { Renderer } from "./renderer.ts";
import type { Config } from "./config.ts";

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
  }

  stop(): void {
    this.#round = "pause";
    this.#timer.stop();
    this.#renderCurrentState(this.#timer.remaining());
  }

  resume(): void {
    this.#timer.resume();
  }

  async #startWork(): Promise<void> {
    this.#round = "work";
    for await (
      const remaining of this.#timer.start(this.#config.workMinutes)
    ) {
      this.#renderCurrentState(remaining);
    }
  }

  async #startShortBreak(): Promise<void> {
    this.#round = "short-break";
    for await (
      const remaining of this.#timer.start(
        this.#config.shortBreakMinutes,
      )
    ) {
      this.#renderCurrentState(remaining);
    }
  }

  async #startLongBreak(): Promise<void> {
    this.#round = "long-break";
    for await (
      const remaining of this.#timer.start(
        this.#config.longBreakMinutes,
      )
    ) {
      this.#renderCurrentState(remaining);
    }
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

  #notify(message: string): Promise<void> {
    return this.#notifier.notify(
      this.#config.notificationTitle,
      message,
    );
  }
}
