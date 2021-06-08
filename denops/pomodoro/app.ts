import { main } from "./deps.ts";
import { createNotifier } from "./notifiers.ts";

main(async ({ vim }) => {
  vim.register({
    async notify() {
      const notifier = createNotifier();
      const title = "Test";
      const message = "Hello!";
      await notifier.notify(title, message);
    },
  });

  await vim.execute(
    `command! DenopsNotify call denops#notify("${vim.name}", "notify", [])`,
  );
});
