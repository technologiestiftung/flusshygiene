import * as wss from './../src/websocket-server';

import WebSocket from 'ws';
import express from 'express';
import http from 'http';

jest.useFakeTimers();

describe('Testing basic websocket server', () => {
  let app, server, ws;

  beforeAll((done) => {
    app = express();
    server = http.createServer(app);
    ws = wss.websocketServer(server);
    server.listen(5555, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  test('should create a WebsocketServer', () => {
    const s = http.createServer(jest.fn);
    const locws = wss.websocketServer(s);
    expect(locws).toBeInstanceOf(WebSocket.Server);
  });

  test('should submit to all sockets', async (done) => {
    const mockWssListener = jest
      .spyOn(wss, 'listener')
      .mockImplementation((message: WebSocket.Data) => {
        // process.stdout.write(`${message}`);
      });
    const mockStdOut = jest.spyOn(process.stdout, 'write');
    const client = new WebSocket('ws://localhost:5555');
    wss.wsSubmit(ws, { foo: 'bah' });
    client.on('message', (message) => {
      client.send('foo', (err) => {
        if (err) throw err;
        // expect(mockWssListener).toHaveBeenCalled();
        expect(message).toBe(wss.greeting);
        // expect(mockStdOut).toHaveBeenCalled();
        mockWssListener.mockRestore();
        mockStdOut.mockRestore();
        done();
      });
    });
  });

  test.skip('testing submission of data', async (done) => {
    const client = new WebSocket('ws://localhost:5555');
    if (client.OPEN === WebSocket.OPEN) {
      wss.wsSubmit(ws, JSON.stringify({ foo: 'bah' }));
      client.on('message', (data) => {
        expect(data).toBe({ foo: 'bah' });
        done();
      });
    }
  });
});
