const { spawn } = require("child_process");
const libraryPaths = {
  youtubeDownload: "../lib/youtube-dl.exe",
  ffmpeg: "../lib/ffmpeg.exe",
};

const youtubeUrl = "https://www.youtube.com/watch?v=";

const VideoController = {
  downloadVideo: (videoId, convertToMusic) => {
    return new Promise((resolve, reject) => {
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

      child.stdout.setEncoding("utf8");
      child.stderr.setEncoding("utf8");
      child.stdout.on("data", (data) => console.log(data));
      child.stderr.on("data", (data) => console.log(data));

      child.on("close", (code) => {
        if (code === 0) {
          resolve(code);
        } else {
          const error = new Error(
            `Erreur pendant le téléchargement. Code youtube-dl : ${code}.`
          );
          reject(error);
        }
      });
    });
  },
};

module.exports = VideoController;
