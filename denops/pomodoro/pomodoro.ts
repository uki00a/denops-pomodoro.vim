import type { Timer } from "./timer.ts";
import type { Notifier } from "./notifiers.ts";
import type { Renderer } from "./renderer.ts";

export class Pomodoro {
  #timer: Timer;
  #notifier: Notifier;
  #renderer: Renderer;

  constructor(
    timer: Timer,
    notifier: Notifier,
    renderer: Renderer,
  ) {
    this.#timer = timer;
    this.#notifier = notifier;
    this.#renderer = renderer;
  }

  async start(): Promise<void> {
    for await (const remaining of this.#timer.start()) {
      this.#renderer.render(remaining);
    }
    await this.#notifier.notify("DONE", "DONE");
  }

  stop(): void {
    this.#timer.stop();
  }

  resume(): void {
    this.#timer.resume();
  }
}
