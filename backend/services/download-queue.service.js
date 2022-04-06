const downloadVideoService = require("./download-video.service");
const socketService = require("./socket.service");
const videoDataService = require("./video-data.service");

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

  async startDownload() {
    console.log("start download");
    if (!this.isDownloadStarted) {
      await this.downloadVideosInQueue();
    }
    console.log("end download");
  }

  async downloadVideosInQueue() {
    this.setIsDownloadStarted(true);

    while (this.queue.length > 0) {
      let currentVideo = this.queue.shift();

      try {
        socketService.getSocket().emit("download-begin", currentVideo.id, currentVideo.videoId);
        await downloadVideoService.downloadVideo(currentVideo);
        await videoDataService.updateDownloadStatus(currentVideo.id, true);
        socketService.getSocket().emit("download-ended", currentVideo.id, true);
      } catch (codeError) {
        console.error(codeError);
        socketService.getSocket().emit("download-error", codeError);
        socketService.getSocket().emit("download-ended", currentVideo.id, false);
      }
    }
    this.setIsDownloadStarted(false);
  }
}

module.exports = new DownloadQueueService();
