import WebSocket, { OPEN as WSOPEN } from 'ws';

import http from 'http';

const greeting = 'welcome from backend WebSocketServer';
const connection = (socket: WebSocket) => {
  socket.on('message', listener);
  socket.send(greeting);
};

const listener = (message: WebSocket.Data) => {
  process.stdout.write(`received: ${message}\n`);
};

const websocketServer = (server: http.Server) => {
  const wsServer = new WebSocket.Server({ server });
  wsServer.on('connection', connection);
  return wsServer;
};

const wsSubmit: (wsserver: WebSocket.Server, data?: any) => void = (
  wsserver,
  data,
) => {
  wsserver.clients.forEach((client) => {
    if (client.readyState === WSOPEN) {
      client.send(data);
    }
  });
};

export { wsSubmit, websocketServer, listener, connection, greeting };
