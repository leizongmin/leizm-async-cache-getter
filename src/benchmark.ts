import Benchmark from "@leizm/benchmark";
import AsyncCacheGetter from "./getter";

const b = new Benchmark({ title: "@leizm/async-throttle Benchmark", concurrent: 10000 });

const c = new AsyncCacheGetter({ timeout: 10000 });

b.addAsync("#get", async () => {
  await c.get("a", async () => makeAsync(123456));
})
  .run()
  .then(r => b.print(r))
  .catch(console.log);

function makeAsync(ret: any) {
  return new Promise(resolve => setTimeout(() => resolve(ret), 0));
}
