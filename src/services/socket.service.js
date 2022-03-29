const io = require("socket.io-client");
const socketServerPort = 9000;

class SocketDownloadService {
  createServer() {
    return io(`http://localhost:${socketServerPort}`);
  }
}

module.exports = new SocketDownloadService();
