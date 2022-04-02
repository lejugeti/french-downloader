const { Server } = require("socket.io");

class SocketService {
  socket;

  getSocket() {
    return this.socket;
  }

  createSocket(port) {
    this.socket = new Server(port, {
      cors: {
        origin: `http://localhost:3000`,
      },
    });

    this.socket.on("connection_error", (err) => console.log(error));

    // return new Server(port, {
    //   cors: {
    //     origin: `http://localhost:3000`,
    //   },
    // });
  }
}

module.exports = new SocketService();
