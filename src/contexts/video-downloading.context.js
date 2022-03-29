const React = require("react");

var VideoDownloadingContext = React.createContext({
  currentVideoKeyId: "videoId",
  updateVideoDownloading: (videoId) => {},
  resetVideoDownloading: () => {},
});

module.exports = VideoDownloadingContext;
