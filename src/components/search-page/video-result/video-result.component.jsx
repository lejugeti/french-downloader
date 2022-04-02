import React, { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import YoutubeDownloadService from "../../../services/videos.service";
import VideoDownloadingContext from "../../../contexts/video-downloading.context";
import socketService from "../../../services/socket.service";

import DownloadProgress from "../../download-progress/download-progress.component";
import DownloadStatus from "../../download-status/download-status.component";

import "./video-result.css";

const VideoResult = ({ video, alreadyDownloaded, previousDownloadError }) => {
  const { id, snippet } = video;
  const { thumbnails } = snippet;

  var _isMounted = true;
  var videoContext = useContext(VideoDownloadingContext);
  var [socketDownload, setSocketDownload] = useState();
  var [percentageDownload, setPercentageDownload] = useState();
  var [timeDownload, setTimeDownload] = useState();
  var [downloadError, setDownloadError] = useState(false);
  var [downloadDate, setDownloadDate] = useState("");

  useEffect(() => {
    if (videoContext.currentVideoDownloading.videoId === video.videoId) {
      openDownloadSocket();
    }

    if (previousDownloadError) {
      setDownloadError(previousDownloadError);
    }

    return function cleanup() {
      _isMounted = false;
      setSocketDownload(null);
    };
  }, []);

  //#region Setters safe
  const setSocketDownloadSafe = (socket) => {
    if (_isMounted) {
      setSocketDownload(socket);
    }
  };

  const setPercentageDownloadSafe = (percentage) => {
    if (_isMounted) {
      setPercentageDownload(percentage);
    }
  };

  const setTimeDownloadSafe = (time) => {
    if (_isMounted) {
      setTimeDownload(time);
    }
  };

  const setDownloadDateSafe = (date) => {
    if (_isMounted) {
      setDownloadDate(date);
    }
  };

  const setDownloadErrorSafe = (error) => {
    if (_isMounted) {
      setDownloadError(error);
    }
  };
  //#endregion

  const handleDownloadVideo = (convertToMusic) => {
    YoutubeDownloadService.downloadVideo(video, convertToMusic)
      .then((videoDownloading) => {
        videoContext.updateVideoDownloading(videoDownloading.id, videoDownloading.videoId);
        openDownloadSocket();

        setDownloadErrorSafe(videoDownloading.error);
        setDownloadDateSafe(videoDownloading.date);
      })
      .catch((error) => console.log(error));
  };

  const openDownloadSocket = () => {
    var socket = socketService.createServer();

    socket.on("connection_error", (err) => console.log(error));
    socket.on("disconnect", () => {
      socket.close();
      setSocketDownload(null);
      videoContext.resetVideoDownloading();
    });
    socket.on("downloadInfos", (percentageDownloadData, timeDownloadData) => {
      console.log({ percentageDownloadData, timeDownloadData });
      setPercentageDownloadSafe(percentageDownloadData);
      setTimeDownloadSafe(timeDownloadData);
    });
    socket.on("error", (errorCode) => {
      console.log({ errorCode });
      setDownloadErrorSafe(true);
    });

    setSocketDownloadSafe(socket);
  };

  const videoIsDownloading = () => {
    return socketDownload !== null && socketDownload !== undefined;
  };

  const showDownloadStatus = () => {
    return !videoIsDownloading() && alreadyDownloaded;
  };

  return (
    <div className='video-result'>
      <img
        className='video-thumbnail'
        style={{
          height: thumbnails.medium.height,
          width: thumbnails.medium.width,
        }}
        src={thumbnails.medium.url}
      />
      <div className='video-informations'>
        <span className='video-title'>{snippet.title}</span>
        <span className='video-channel'>{snippet.channelTitle}</span>

        <div className='download-informations'>
          {videoIsDownloading() && (
            <DownloadProgress percentageDownload={percentageDownload} timeDownload={timeDownload} />
          )}
          {showDownloadStatus() && <DownloadStatus downloadDate={downloadDate} downloadError={downloadError} />}
        </div>

        <div className='video-buttons'>
          <Button
            variant='contained'
            color='primary'
            className='download-btn'
            onClick={() => handleDownloadVideo(true)}>
            <DownloadIcon />
            <span>Musique</span>
          </Button>
          <Button
            variant='contained'
            color='secondary'
            className='download-btn'
            onClick={() => handleDownloadVideo(false)}>
            <DownloadIcon />
            <span>Vidéo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoResult;
