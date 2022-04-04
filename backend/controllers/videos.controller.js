const { spawn } = require("child_process");
var videoDataService = require("../services/video-data.service");
const downloadQueueService = require("../services/download-queue.service");

class VideoController {
  getVideosDownloaded() {
    return videoDataService.getVideos();
  }

  getVideosDownloadedFilter(videoIdList) {
    return videoDataService.getVideosFiltered(videoIdList);
  }

  handleDownloadVideo(video, convertToMusic) {
    const videoToDownload = {
      id: videoDataService.getNewId(),
      ...video,
      date: new Date().toLocaleString(),
      convertToMusic,
      isDownloaded: false,
      error: false,
    };

    videoDataService.addVideo(videoToDownload);
    downloadQueueService.addVideoToQueue(videoToDownload);
    downloadQueueService.startDownload();

    return videoToDownload;
  }

  deleteVideo(videoId, date) {
    return new Promise(async (resolve, reject) => {
      try {
        await videoDataService.removeVideo(videoId, date);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = new VideoController();
