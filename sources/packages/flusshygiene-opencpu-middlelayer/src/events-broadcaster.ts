import { EventEmitter } from 'events';

declare interface BroadCaster {
  on(event: 'passthrough', listener: (name: any) => void): this;
  on(event: string, listener: Function): this;
}

class BroadCaster extends EventEmitter {
  public static getInstance() {
    if (!BroadCaster.instance) {
      BroadCaster.instance = new BroadCaster('Singleton');
    }
    return BroadCaster.instance;
  }
  private static instance: BroadCaster;
  private constructor(public readonly name: string) {
    super();
  }
}

export { BroadCaster };
