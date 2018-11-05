const WebSocket = require('ws');

module.exports = function create(port, onMessage, onClose) {
  const socket = new WebSocket.Server({ port });
  const sockets = [];

  socket.on('connection', (ws) => {
    sockets.push(ws);
    ws.on('message', onMessage);
    const { send } = ws;
    ws.send = (message) => { console.log('socket:send', message); send.call(ws, message); };
    ws.on('close', () => {
      const idx = sockets.indexOf(ws);
      sockets.splice(idx, 1);
      onClose();
    });
  });

  return { socket, sockets };
};
