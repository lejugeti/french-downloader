const React = require("react");

var VideoDownloadingContext = React.createContext({
  currentVideoDownloading: { id: "id", videoId: "videoId" },
  updateVideoDownloading: (id, videoId) => {},
  resetVideoDownloading: () => {},
});

module.exports = VideoDownloadingContext;
