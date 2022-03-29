const { Server } = require("socket.io");

class SocketService {
  createSocket(port) {
    return new Server(port, {
      cors: {
        origin: `http://localhost:3000`,
      },
    });
  }
}

module.exports = new SocketService();
