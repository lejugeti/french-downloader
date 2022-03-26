const fs = require("fs");
const path = require("path");

class VideoDataService {
  videos = [];
  dataPath = "./data/videos.json";

  constructor() {
    this.readData();
  }

  getVideos() {
    return this.videos;
  }

  getVideosAsString() {
    return JSON.stringify(this.videos);
  }

  addVideo(video) {
    this.videos = this.filterVideosWithError(video.id);
    this.videos.push(video);
    this.saveData();
  }

  addVideoWithError(video) {
    this.videos = this.filterVideosWithError(video.id);
    this.videos.push(video);
    this.saveData();
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

  saveData() {
    this.writeData();
  }

  filterVideosWithError(videoId) {
    return this.videos.filter((vid) => vid.id !== videoId || (vid.id === videoId && vid.error == false));
  }

  //#region manipulate data file
  createDataFile() {
    this.videos = [];
    this.writeData();
  }

  readData() {
    fs.readFile(this.dataPath, "utf8", (err, videosData) => {
      if (err && err.code === "ENOENT") {
        console.log(`Creating new videos data file at ${path.join(__dirname, this.dataPath)}`);

        this.createDataFile();
      } else {
        this.videos = JSON.parse(videosData);
      }
    });
  }

  writeData() {
    fs.writeFile(this.dataPath, JSON.stringify(this.getVideos()), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  //#endregion
}

module.exports = new VideoDataService();
