import { Vim } from "./deps.ts";

export interface Renderer {
  render(remaining: number): Promise<void>;
}

class VimRenderer implements Renderer {
  #vim: Vim;

  constructor(vim: Vim) {
    this.#vim = vim;
  }

  async render(remaining: number): Promise<void> {
    await this.#vim.g.set("pomodoro_timer_status", makeStatusline(remaining));
  }
}

function makeStatusline(remaining: number): string {
  const minutes = Math.floor((remaining / 1000) / 60);
  const seconds = (remaining / 1000) % 60;
  return `${String(minutes).padStart(2, "0")}:${
    String(seconds).padStart(2, "0")
  }`;
}

export function createRenderer(vim: Vim): Renderer {
  return new VimRenderer(vim);
}
