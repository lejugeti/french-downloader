const { spawn } = require("child_process");
var videoDataService = require("../services/video-data.service");

const youtubeUrl = "https://www.youtube.com/watch?v=";
const libraryPaths = {
  youtubeDownload: "../lib/youtube-dl.exe",
  ffmpeg: "../lib/ffmpeg.exe",
};

class VideoController {
  getVideosDownloaded() {
    return videoDataService.getVideos();
  }

  downloadVideo(video, convertToMusic) {
    return new Promise((resolve, reject) => {
      const videoId = video.videoId;

      console.log(
        `Download video with id=${videoId} as a ${
          convertToMusic === true ? "MUSIC" : "VIDEO"
        } FILE`
      );

      const command = `${libraryPaths.youtubeDownload}`;
      const downloadPath =
        convertToMusic === true
          ? "../downloads/music/%(title)s.%(ext)s"
          : "../downloads/videos/%(title)s.%(ext)s";

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
      child.stderr.on("data", (data) => console.log(data));

      child.on("close", (code) => {
        const videoData = { ...video, date: new Date().toLocaleString() };

        if (code === 0) {
          videoData["error"] = false;
          videoDataService.addVideo(videoData);
          resolve(code);
        } else {
          const error = new Error(
            `Erreur pendant le téléchargement. Code youtube-dl : ${code}.`
          );

          videoData["error"] = true;
          videoDataService.addVideoWithError(videoData);
          reject(error);
        }
      });
    });
  }
}

module.exports = new VideoController();
