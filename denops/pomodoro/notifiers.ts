import { notify } from "./deps.ts";

export interface Notifier {
  notify(title: string, message: string): Promise<void>;
}

export function createNotifier(): Notifier {
  // TODO: Improve error handling
  return { notify };
}
