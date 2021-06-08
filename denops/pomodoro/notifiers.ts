import { readAll } from "./deps.ts";

export interface Notifier {
  notify(title: string, message: string): Promise<void>;
}

class NotifySendNotifier implements Notifier {
  async notify(title: string, message: string): Promise<void> {
    const process = Deno.run({
      cmd: ["notify-send", title, message],
      stderr: "piped",
    });
    try {
      const status = await process.status();
      if (!status.success) {
        const output = await readAll(process.stderr);
        const decoder = new TextDecoder();
        throw new Error(decoder.decode(output));
      }
    } finally {
      process.stderr.close();
      process.close();
    }
  }
}

// TODO: Add more notifiers
export function createNotifier(): Notifier {
  return new NotifySendNotifier();
}
