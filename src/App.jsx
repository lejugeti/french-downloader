import "./App.css";

import Navbar from "./components/navbar/navbar.component";
import VideoDownloadingContext from "./contexts/video-downloading.context";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  var [currentVideoId, setVideoDownloadingId] = useState(null);

  const updateVideoDownloading = (videoId) => setVideoDownloadingId(videoId);
  const resetVideoDownloading = () => setVideoDownloadingId(null);

  const videoDownloadingContextValue = { currentVideoId, updateVideoDownloading, resetVideoDownloading };

  return (
    <VideoDownloadingContext.Provider value={videoDownloadingContextValue}>
      <div className='App'>
        <Navbar />
        <Outlet />
      </div>
    </VideoDownloadingContext.Provider>
  );
}

export default App;
