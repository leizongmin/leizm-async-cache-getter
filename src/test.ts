import { expect } from "chai";
import AsyncCacheGetter, { AsyncCacheGetterTimeoutError } from "./getter";

function sleep(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

describe("AsyncCacheGetter", function() {
  it("获得数据", async function() {
    const cache = new AsyncCacheGetter({ timeout: 1000 });
    expect(
      await cache.get("a", async () => {
        sleep(20);
        return 12345;
      }),
    ).to.equal(12345);
    expect(
      await cache.get("a", async () => {
        sleep(50);
        return 45678;
      }),
    ).to.equal(45678);
  });

  it("并发获得数据", async function() {
    const cache = new AsyncCacheGetter({ timeout: 1000 });
    const tag = "dadada";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(50);
      return 11111111;
    }
    const ret = await Promise.all([
      cache.get(tag, getData),
      cache.get(tag, getData),
      cache.get(tag, getData),
      cache.get(tag, getData),
      cache.get(tag, getData),
      cache.get(tag, getData),
      cache.get(tag, getData),
    ]);
    expect(counter).to.equal(1);
    expect(ret).to.deep.equal([11111111, 11111111, 11111111, 11111111, 11111111, 11111111, 11111111]);
  });

  it("并发获得数据超时", async function() {
    const cache = new AsyncCacheGetter({ timeout: 50 });
    const tag = "dadada";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(100);
      return 11111111;
    }
    let isThrowError = false;
    try {
      await Promise.all([
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
      ]);
    } catch (err) {
      isThrowError = true;
      expect(err).to.instanceOf(AsyncCacheGetterTimeoutError);
    }
    expect(isThrowError).to.equal(true);
    expect(counter).to.equal(1);
  });

  it("并发获得数据出错", async function() {
    const cache = new AsyncCacheGetter({ timeout: 100 });
    const tag = "dadada";
    let counter = 0;
    async function getData() {
      counter++;
      await sleep(50);
      throw new Error("test error");
    }
    let isThrowError = false;
    try {
      await Promise.all([
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
        cache.get(tag, getData),
      ]);
    } catch (err) {
      isThrowError = true;
      expect(err.message).to.equal("test error");
    }
    expect(isThrowError).to.equal(true);
    expect(counter).to.equal(1);
  });
});
