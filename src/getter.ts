export interface IAsyncCacheGetterOptions {
  timeout: number;
}

export class AsyncCacheGetterTimeoutError extends Error {
  public name: string = "AsyncCacheGetterTimeoutError";
  public code: string = "TIMEOUT";
}

export interface ITagItem {
  timestamp: number;
  tid: NodeJS.Timeout;
  listeners: Array<{
    resolve: (ret: any) => void;
    reject: (err: Error) => void;
  }>;
}

export class AsyncCacheGetter {
  protected tags: Map<string, ITagItem> = new Map();
  protected timeout: number;

  constructor(options: IAsyncCacheGetterOptions) {
    this.timeout = options.timeout;
  }

  protected resolve(tag: string, ret: any) {
    const item = this.tags.get(tag);
    this.tags.delete(tag);
    if (item) {
      item.listeners.forEach(({ resolve }) => resolve(ret));
    }
  }

  protected reject(tag: string, err: Error) {
    const item = this.tags.get(tag);
    this.tags.delete(tag);
    if (item) {
      item.listeners.forEach(({ reject }) => reject(err));
    }
  }

  /**
   * 获取缓存
   * @param tag 本次获取数据的标签名称
   * @param getData 如果没有相同的正在等待的队列，则使用此函数获取数据
   */
  public get<T>(tag: string, getData: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const item = this.tags.get(tag);
      if (item) {
        item.listeners.push({ resolve, reject });
      } else {
        const timestamp = Date.now();
        const tid = setTimeout(() => {
          const oldItem = this.tags.get(tag);
          if (oldItem && oldItem.timestamp === timestamp) {
            this.reject(tag, new AsyncCacheGetterTimeoutError());
          }
        }, this.timeout);
        this.tags.set(tag, { timestamp, tid, listeners: [{ resolve, reject }] });
        getData()
          .then(ret => this.resolve(tag, ret))
          .catch(err => this.reject(tag, err));
      }
    });
  }
}

export default AsyncCacheGetter;
