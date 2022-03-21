const fs = require("fs");
const path = require("path");

class VideoDataService {
  data = [];
  dataPath = "./data/videos.json";

  constructor() {
    this.readData();
  }

  addVideo(video) {
    this.data = this.filterVideosWithError(video.id);
    this.data.push(video);
    this.saveData();
  }

  addVideoWithError(video) {
    this.data = this.filterVideosWithError(video.id);
    this.data.push(video);
    this.saveData();
  }

  saveData() {
    this.writeData();
  }

  filterVideosWithError(videoId) {
    return this.data.filter(
      (vid) => vid.id !== videoId || (vid.id === videoId && vid.error == false)
    );
  }

  //#region manipulate data file
  createDataFile() {
    this.data = [];
    this.writeData();
  }

  readData() {
    fs.readFile(this.dataPath, "utf8", (err, videosData) => {
      if (err && err.code === "ENOENT") {
        console.log(
          `Creating new videos data file at ${path.join(
            __dirname,
            this.dataPath
          )}`
        );

        this.createDataFile();
      } else {
        this.data = JSON.parse(videosData);
      }
    });
  }

  writeData() {
    fs.writeFile(this.dataPath, JSON.stringify(this.data), (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
  //#endregion
}

module.exports = new VideoDataService();
