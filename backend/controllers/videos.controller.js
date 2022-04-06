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
    let videoToDownload;
    if (videoDataService.videoIsAlreadySaved(video) && !video.isDownloaded) {
      console.log("BPOZJFPOIEJF");
      videoToDownload = video;
    } else {
      videoToDownload = {
        ...video,
        id: videoDataService.getNewId(),
        date: new Date().toLocaleString(),
        convertToMusic,
        isDownloaded: false,
        error: false,
      };
      videoDataService.addVideo(videoToDownload);
    }

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
