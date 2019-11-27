import { EventEmitter } from 'events';
import { Request, Response } from 'express';
import { IObject } from './common/interfaces';
import { logger } from './logger';

/**
 * SSE plugged from https://github.com/dpskvn/express-sse/blob/master/index.js
 */
interface IServerSideEventPayload {
  id?: number;
  event?: string;
  data: IObject;
}
declare interface BroadCaster {
  on(event: 'passthrough', listener: (name: any) => void): this;
  on(event: string, listener: Function): this;
  on(event: 'data', listener: (payload: IServerSideEventPayload) => void): this;
}

class BroadCaster extends EventEmitter {
  public static getInstance() {
    if (!BroadCaster.instance) {
      BroadCaster.instance = new BroadCaster('Singleton');
    }
    return BroadCaster.instance;
  }
  private id: number = 0;
  private event: string = 'passthrough';
  private static instance: BroadCaster;
  private constructor(public readonly name: string) {
    super();
  }
  public route(request: Request, response: Response): void {
    logger.info(`Connection established with session id: ${request.sessionID}`);
    request.socket.setTimeout(0);
    request.socket.setNoDelay(true);
    request.socket.setKeepAlive(true);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'text/event-stream');
    response.setHeader('Cache-Control', 'no-cache');
    if (request.httpVersion !== '2.0') {
      response.setHeader('Connection', 'keep-alive');
    }
    const dataHandler: (payload: IServerSideEventPayload) => void = (
      payload,
    ) => {
      response.write(
        `id: ${
          payload.id === undefined ? BroadCaster.instance.id : payload.id
        }\n`,
      );

      response.write(
        `event: ${
          payload.event === undefined
            ? BroadCaster.instance.event
            : payload.event
        }\n`,
      );
      response.write(`data: ${JSON.stringify(payload.data)}\n\n`);
      BroadCaster.instance.id++;
    };

    BroadCaster.instance.on('data', dataHandler);
    // response.setHeader('Content-Encoding', 'deflate');
    // Remove listeners and reduce the number of max listeners on client disconnect
    request.on('close', () => {
      BroadCaster.instance.removeListener('data', dataHandler);
    });
  }
}

export { BroadCaster };
