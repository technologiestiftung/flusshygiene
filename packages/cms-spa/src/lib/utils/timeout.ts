// export function Timer(callback, delay) {
//   let timerId;
//   let start;
//   let remaining = delay;

//   this.pause = function() {
//     window.clearTimeout(timerId);
//     remaining -= new Date() - start;
//   };

//   this.resume = function() {
//     start = new Date();
//     window.clearTimeout(timerId);
//     timerId = window.setTimeout(callback, remaining);
//   };

//   this.resume();
// }

/**
 * A Timer that can be started and stopped
 *
 * Taken from here
 * https://gist.github.com/ncou/3a0a1f89c8e22416d0d607f621a948a9
 *
 * @example
 * const timer = new Timer(()=>{ console.log('timeout'), 1000});
 *
 * timer.start()
 * ...
 * timer.pause()
 *...
 * timer.resume()
 */
export class Timer {
  timerId: any;
  callback: any;
  startTime: any;
  remaining: any;

  constructor(callback: any, delay: number) {
    this.callback = callback;
    this.remaining = delay;
  }

  pause() {
    clearTimeout(this.timerId);
    this.remaining -= Date.now() - this.startTime;
  }
  resume() {
    this.startTime = Date.now();
    clearTimeout(this.timerId);
    this.timerId = setTimeout(this.callback, this.remaining);
  }
  start() {
    this.resume();
  }
}
