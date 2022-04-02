const io = require("socket.io-client");
const socketServerPort = 9000;

class SocketDownloadService {
  createServer() {
    return io(`http://localhost:${socketServerPort}`);
  }

  createSocket({ setVideoId, setVideoYoutubeId, setErrorDownload, setPercentageDownload, setTimeDownload }) {
    var socket = io(`http://localhost:${socketServerPort}`);

    socket.on("download-begin", (videoId, videoYoutubeId) => {
      // console.log({ videoId, videoYoutubeId });
      setVideoId(videoId);
      setVideoYoutubeId(videoYoutubeId);
    });
    socket.on("download-informations", (percentage, time) => {
      // console.log({ percentage, time });
      setPercentageDownload(percentage);
      setTimeDownload(time);
    });
    socket.on("download-ended", () => {
      setVideoId(null);
      setVideoYoutubeId(null);
      setPercentageDownload(null);
      setTimeDownload(null);
    });
    socket.on("download-error", (error) => {
      // console.log({ error });
      setErrorDownload(error);
    });
    socket.on("disconnect", (reason) => {
      socket.disconnect();
    });

    return socket;
  }
}

module.exports = new SocketDownloadService();
