const fs = require("fs");
const path = require("path");

class VideoDataService {
  videos = [];
  dataPath = "./data/videos.json";

  constructor() {
    this.readData();
  }

  getNewId() {
    return this.videos.length != 0 ? Math.max(...this.getVideos().map((video) => video.id)) + 1 : 0;
  }

  getVideos() {
    return this.videos;
  }

  getVideosNotDownloaded() {
    return this.videos.filter((video) => video.isDownloaded === false);
  }

  getVideosAsString() {
    return JSON.stringify(this.videos);
  }

  getVideosFiltered(videoIdList) {
    return this.videos.filter((video) => videoIdList.includes(video.videoId));
  }

  videoIsAlreadySaved(video) {
    return this.videos.some((vid) => vid.id === video.id && vid.videoId === video.videoId);
  }

  addVideo(video) {
    this.videos = this.filterVideosWithError(video.videoId);
    this.videos.push(video);
    this.saveData();
  }

  addVideoWithError(video) {
    this.videos = this.filterVideosWithError(video.videoId);
    this.videos.push(video);
    this.saveData();
  }

  async updateDownloadStatus(id, isDownloaded) {
    this.videos.find((video) => video.id === id).isDownloaded = isDownloaded;
    await this.saveData();
  }

  async updateErrorStatus(id, errorOccurred) {
    this.videos.find((video) => video.id === id).error = errorOccurred;
    await this.saveData();
  }

  removeVideo(videoId, date) {
    const videoIndex = this.videos.findIndex((video) => video.videoId === videoId && video.date === date);

    if (videoIndex != -1) {
      this.videos.splice(videoIndex, 1);
      this.saveData();
    } else {
      throw new Error("Aucune vidéo présente en mémoire");
    }
  }

  async saveData() {
    await this.writeData();
  }

  filterVideosWithError(videoId) {
    return this.videos.filter((vid) => vid.videoId !== videoId || (vid.videoId === videoId && vid.error == false));
  }

  //#region manipulate data file
  async createDataFile() {
    this.videos = [];
    await this.writeData();
  }

  readData() {
    return new Promise((resolve) => {
      fs.readFile(this.dataPath, "utf8", async (err, videosData) => {
        if (err && err.code === "ENOENT") {
          console.log(`Creating new videos data file at ${path.join(__dirname, this.dataPath)}`);

          await this.createDataFile();
        } else {
          this.videos = JSON.parse(videosData);
        }
        resolve();
      });
    });
  }

  writeData() {
    return new Promise((resolve) => {
      fs.writeFile(this.dataPath, JSON.stringify(this.getVideos()), (err) => {
        if (err) {
          console.error(err);
        }
        resolve();
      });
    });
  }
  //#endregion
}

module.exports = new VideoDataService();
