const downloadVideoService = require("./download-video.service");
const socketService = require("./socket.service");

class DownloadQueueService {
  queue = [];
  isDownloadStarted = false;

  getQueue() {
    return this.queue;
  }

  setQueue(newQueue) {
    this.queue = newQueue;
  }

  addVideoToQueue(video) {
    this.queue.push(video);
  }

  isDownloadStarted() {
    return this.isDownloadStarted;
  }

  setIsDownloadStarted(downloadStatus) {
    this.isDownloadStarted = downloadStatus;
  }

  startDownload() {
    console.log("start download");
    if (!this.isDownloadStarted) {
      this.downloadVideosInQueue();
    }
  }

  async downloadVideosInQueue() {
    console.log({ queue: this.queue });
    this.setIsDownloadStarted(true);

    while (this.queue.length > 0) {
      let currentVideo = this.queue.shift();

      try {
        socketService.getSocket().emit("download-begin", currentVideo.id, currentVideo.videoId);
        await downloadVideoService.downloadVideo(currentVideo);
      } catch (codeError) {
        console.error(codeError);
        socketService.getSocket().emit("download-error", codeError);
      } finally {
        socketService.getSocket().emit("download-ended");
      }
    }
    this.setIsDownloadStarted(false);
  }
}

module.exports = new DownloadQueueService();
