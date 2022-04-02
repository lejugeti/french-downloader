const { spawn } = require("child_process");
var videoDataService = require("../services/video-data.service");
const socketService = require("../services/socket.service");

const youtubeUrl = "https://www.youtube.com/watch?v=";
const libraryPaths = {
  youtubeDownload: "../lib/youtube-dl.exe",
  ffmpeg: "../lib/ffmpeg.exe",
};

class VideoController {
  maxRetry = 3;
  percentagePattern = /\d{2,3}\.?\d{0,2}%/;
  httpCodePattern = /(?<= )\d{3}(?!\.)/;
  timePattern = /(?<=ETA )\d{2}:\d{2}/;

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
      error: false,
    };

    videoDataService.addVideo(videoToDownload);
    this.downloadVideo(videoToDownload, convertToMusic, 0)
      .then((code) => {})
      .catch((errorCode) => {
        socketService.getSocket().emit("download-error", errorCode);
      })
      .finally(() => socketService.getSocket().emit("download-ended"));

    return videoToDownload;
  }

  downloadVideo(video, convertToMusic) {
    return new Promise(async (resolve, reject) => {
      try {
        socketService.getSocket().emit("download-begin", video.id, video.videoId);
        var code = await this.spawnDownloadScript(video, convertToMusic);

        if (code === 0) {
          resolve(code);
          return;
        } else if (code === 403) {
          for (let nbRetry = 0; nbRetry < this.maxRetry; nbRetry++) {
            console.log(`Error 403 while downloading. Retry number ${nbRetry} download video with ID=${video.videoId}`);

            code = await this.spawnDownloadScript(video, convertToMusic, nbRetry + 1);
            if (code === 0) {
              resolve(code);
              return;
            } else if (code !== 0 && code !== 403) {
              throw code;
            }
          }

          // les retry ont échoués
          throw code;
        } else {
          // Erreur autre
          throw code;
        }
      } catch (errorCode) {
        console.error(`Erreur pendant le téléchargement. Code youtube-dl : ${errorCode}.`);
        videoDataService.addVideoWithError({
          ...video,
          date: new Date().toLocaleString(),
          error: true,
        });

        reject(errorCode);
        return;
      }
    });
  }

  spawnDownloadScript(video, convertToMusic) {
    return new Promise((resolve, reject) => {
      const { videoId } = video;
      var httpErrorCode = null;

      console.log(`Download video with id=${videoId} as a ${convertToMusic === true ? "MUSIC" : "VIDEO"} FILE`);

      const command = `${libraryPaths.youtubeDownload}`;
      const downloadPath =
        convertToMusic === true ? "../downloads/music/%(title)s.%(ext)s" : "../downloads/videos/%(title)s.%(ext)s";

      var args = [youtubeUrl + videoId, "-o", downloadPath, "-f", "bestaudio"];

      if (convertToMusic == true) {
        args.push("-x");
        args.push("--audio-format");
        args.push("mp3");
        args.push("--ffmpeg-location");
        args.push(libraryPaths.ffmpeg);
      }

      var child = spawn(command, args);

      // Logs du process
      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (data) => {
        console.log(data);
        if (this.isDownloadInfos(data)) {
          socketService
            .getSocket()
            .emit("download-informations", this.parseDownloadPercentage(data), this.parseDownloadTime(data));
        }
      });

      child.stderr.on("data", (errorData) => {
        console.log(errorData);
        httpErrorCode = this.parseHttpErrorCode(errorData) || httpErrorCode;
      });

      child.on("close", (code) => {
        resolve(httpErrorCode || code);
      });
    });
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

  isDownloadInfos(logLine) {
    return this.percentagePattern.test(logLine) || this.timePattern.test(logLine);
  }

  parseDownloadPercentage(logLine) {
    const parseResult = this.percentagePattern.exec(logLine);
    return parseResult ? parseResult[0] : null;
  }

  parseHttpErrorCode(logLine) {
    const parseResult = this.httpCodePattern.exec(logLine);
    return parseResult ? parseInt(parseResult[0], 10) : null;
  }

  parseDownloadTime(logLine) {
    const parseResult = this.timePattern.exec(logLine);
    return parseResult ? parseResult[0] : null;
  }
}

module.exports = new VideoController();
