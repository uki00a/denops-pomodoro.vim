import type { Denops, VariableHelper } from "./deps.ts";
import { execute, vars } from "./deps.ts";

class Variables {
  #denops: Denops;
  #vars: VariableHelper;
  constructor(denops: Denops, vars: VariableHelper) {
    this.#denops = denops;
    this.#vars = vars;
  }

  get(name: string, defaultValue: unknown): Promise<unknown> {
    return this.#vars.get(this.#denops, name, defaultValue);
  }

  set(name: string, value: unknown): Promise<unknown> {
    return this.#vars.set(this.#denops, name, value);
  }
}

/**
 * This interface provides the same APIs as deno-denops-std@v0.15.0.
 * @see https://github.com/vim-denops/deno-denops-std/tree/v0.15.0
 */
export interface Vim {
  // TODO: Add more namespaces
  g: Variables;

  name: string;

  register(dispatcher: Denops["dispatcher"]): void;
  execute(commands: string[] | string): Promise<void>;
}

export function createVim(denops: Denops): Vim {
  return {
    g: new Variables(denops, vars.g),
    name: denops.name,
    register(dispatcher: Denops["dispatcher"]) {
      denops.dispatcher = dispatcher;
    },
    execute(commands: string[] | string) {
      return execute(denops, commands);
    },
  };
}
