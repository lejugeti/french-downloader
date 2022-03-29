class VideoDownloadingService {
  currentVideoId = "videoId";

  getVideoId() {
    return this.currentVideoId;
  }

  updateVideoDownloading(videoId) {
    this.currentVideoId = videoId;
  }

  resetVideoDownloading() {
    this.currentVideoId = null;
  }
}

module.exports = new VideoDownloadingService();
