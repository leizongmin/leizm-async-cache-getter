# @leizm/async-cache-getter
异步获得数据，保证同一时间多个相同的请求只会实际执行一个

## 安装

```bash
npm install @leizm/async-cache-getter --save
```

## 使用

```typescript
import AsyncCacheGetter from "@leizm/async-cache-getter";

const cache = new AsyncCacheGetter({ timeout: 10000 });

// xxxx 用于区别不同的请求操作，相同的请求其名称应该一致
const ret = await cache.get("xxxx", async () => {
  return 123456;
});
// 返回结果：123456
```

## 性能

```
------------------------------------------------------------------------
@leizm/async-throttle Benchmark
------------------------------------------------------------------------

Platform info:
- Darwin 18.5.0 x64
- Node.JS: 10.15.3
- V8: 6.8.275.32-node.51
  Intel(R) Core(TM) i7-6820HQ CPU @ 2.70GHz × 8


1 tests success:
┌──────┬──────────┬────────┬────────┐
│ test │ rps      │ ns/op  │ spent  │
├──────┼──────────┼────────┼────────┤
│ #get │ 527589.5 │ 1895.4 │ 2.066s │
└──────┴──────────┴────────┴────────┘
```

## License

```
MIT License

Copyright (c) 2019 Zongmin Lei <leizongmin@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
