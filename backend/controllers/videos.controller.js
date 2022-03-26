const { spawn } = require("child_process");
var videoDataService = require("../services/video-data.service");

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

  downloadVideo(video, convertToMusic, nbRetry) {
    return new Promise(async (resolve, reject) => {
      var code = await this.spawnDownloadScript(video, convertToMusic);

      if (code === 403 && nbRetry < this.maxRetry) {
        console.log(`Error 403 while downloading. Retry number ${nbRetry + 1} download video with ID=${video.videoId}`);

        try {
          code = await this.downloadVideo(video, convertToMusic, nbRetry + 1);
          resolve(code);
          return;
        } catch (errorCode) {
          reject(errorCode);
          return;
        }
      }

      if (code === 0) {
        videoDataService.addVideo({
          ...video,
          date: new Date().toLocaleString(),
          error: false,
        });

        resolve(code);
        return;
      } else {
        console.error(`Erreur pendant le téléchargement. Code youtube-dl : ${code}.`);
        videoDataService.addVideoWithError({
          ...video,
          date: new Date().toLocaleString(),
          error: true,
        });

        reject(code);
        return;
      }
    });
  }

  spawnDownloadScript(video, convertToMusic) {
    return new Promise((resolve, reject) => {
      const videoId = video.videoId;
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
      child.stdout.on("data", (data) => console.log(data));
      child.stderr.on("data", (errorData) => {
        console.log(errorData);
        httpErrorCode = this.parseHttpErrorCode(errorData) || httpErrorCode;
      });

      child.on("close", (code) => resolve(httpErrorCode || code));
    });
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
