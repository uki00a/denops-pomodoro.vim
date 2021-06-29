import type { Denops, VariableHelper } from "./deps.ts";

export interface Renderer {
  render(sign: string, remaining: number): Promise<void>;
}

class VimRenderer implements Renderer {
  #denops: Denops;
  #vars: VariableHelper;

  constructor(denops: Denops, vars: VariableHelper) {
    this.#denops = denops;
    this.#vars = vars;
  }

  async render(sign: string, remaining: number): Promise<void> {
    await this.#vars.set(
      this.#denops,
      "pomodoro_timer_status",
      sign + " " + makeStatusline(remaining),
    );
  }
}

function makeStatusline(remaining: number): string {
  const minutes = Math.floor((remaining / 1000) / 60);
  const seconds = (remaining / 1000) % 60;
  return `${String(minutes).padStart(2, "0")}:${
    String(seconds).padStart(2, "0")
  }`;
}

export function createRenderer(denops: Denops, vars: VariableHelper): Renderer {
  return new VimRenderer(denops, vars);
}
