import { Pomodoro } from "../denops/pomodoro/pomodoro.ts";
import { createTimer } from "../denops/pomodoro/timer.ts";
import { Notifier } from "../denops/pomodoro/notifiers.ts";
import { Renderer } from "../denops/pomodoro/renderer.ts";
import { assertEquals, td } from "./deps.ts";

Deno.test("Pomodoro#start", async () => {
  const timer = createTimer(3000, 1000);
  const renderer = td.object<Renderer>();
  const notifier = td.object<Notifier>();
  const pomodoro = new Pomodoro(timer, notifier, renderer);

  await pomodoro.start();

  td.verify(notifier.notify("DONE", "DONE"), { times: 1 });
  {
    const { callCount, description } = td.explain(renderer.render);
    assertEquals(callCount, 3, description);
    td.verify(renderer.render(3000));
    td.verify(renderer.render(2000));
    td.verify(renderer.render(1000));
  }
});
