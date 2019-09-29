// jest.useFakeTimers();

import { websocketServer, wsSubmit } from './../src/websocket-server';

import { Server } from 'mock-socket';
import WebSocket from 'ws';
import http from 'http';

const fakeURL = 'ws://localhost:8080';
const mockServer = new Server(fakeURL);

describe('Testing basic websocket server', () => {
  test('should create a WebsocketServer', () => {
    const server = http.createServer(jest.fn);
    const wss = websocketServer(server);
    expect(wss).toBeInstanceOf(WebSocket.Server);
  });

  test('should submit to all sckets', () => {
    const server = http.createServer(jest.fn);
    const wss = websocketServer(server);
    wsSubmit(wss, { foo: 'bah' });
  });
});
