const React = require("react");

var DownloadContext = React.createContext({
  socket: null,
  videoId: null,
  videoYoutubeId: null,
  errorDownload: false,
  percentageDownload: null,
  timeDownload: null,
  setVideoId: (videoId) => {},
  setVideoYoutubeId: (error) => {},
  setErrorDownload: (error) => {},
  setPercentageDownload: (percentage) => {},
  setTimeDownload: (time) => {},
});

module.exports = DownloadContext;
