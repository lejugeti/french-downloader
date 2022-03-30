import "./App.css";

import Navbar from "./components/navbar/navbar.component";
import VideoDownloadingContext from "./contexts/video-downloading.context";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  var [currentVideoDownloading, setVideoDownloading] = useState({ id: null, videoId: null });

  const updateVideoDownloading = (id, videoId) => setVideoDownloading({ id, videoId });
  const resetVideoDownloading = () => setVideoDownloading({ id: null, videoId: null });

  const videoDownloadingContextValue = { currentVideoDownloading, updateVideoDownloading, resetVideoDownloading };

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
