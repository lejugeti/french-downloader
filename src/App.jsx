import "./App.css";

import Navbar from "./components/navbar/navbar.component";
import VideoDownloadingContext from "./contexts/video-downloading.context";
import DownloadContext from "./contexts/download.context";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import socketService from "./services/socket.service";

function App() {
  var [currentVideoDownloading, setVideoDownloading] = useState({ id: null, videoId: null });

  const updateVideoDownloading = (id, videoId) => setVideoDownloading({ id, videoId });
  const resetVideoDownloading = () => setVideoDownloading({ id: null, videoId: null });

  const videoDownloadingContextValue = { currentVideoDownloading, updateVideoDownloading, resetVideoDownloading };

  //#region Download context definition
  var [videoId, setVideoId] = useState(null);
  var [videoYoutubeId, setVideoYoutubeId] = useState(null);
  var [errorDownload, setErrorDownload] = useState(false);
  var [percentageDownload, setPercentageDownload] = useState(null);
  var [timeDownload, setTimeDownload] = useState(null);

  const socket = socketService.createSocket({
    setVideoId,
    setVideoYoutubeId,
    setErrorDownload,
    setPercentageDownload,
    setTimeDownload,
  });

  const downloadContextValue = {
    socket,
    videoId,
    videoYoutubeId,
    errorDownload,
    percentageDownload,
    timeDownload,
    setVideoId,
    setVideoYoutubeId,
    setErrorDownload,
    setPercentageDownload,
    setTimeDownload,
  };
  //#endregion

  return (
    <DownloadContext.Provider value={downloadContextValue}>
      <VideoDownloadingContext.Provider value={videoDownloadingContextValue}>
        <div className='App'>
          <Navbar />
          <Outlet />
        </div>
      </VideoDownloadingContext.Provider>
    </DownloadContext.Provider>
  );
}

export default App;
