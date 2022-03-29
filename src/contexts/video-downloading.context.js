const React = require("react");

var VideoDownloadingContext = React.createContext({
  currentVideoId: "videoId",
  updateVideoDownloading: (videoId) => {},
  resetVideoDownloading: () => {},
});

module.exports = VideoDownloadingContext;
