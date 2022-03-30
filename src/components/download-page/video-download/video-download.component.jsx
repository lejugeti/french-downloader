import React, { useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import VideosService from "../../../services/videos.service";
import VideoDownloadingContext from "../../../contexts/video-downloading.context";
import socketService from "../../../services/socket.service";

import DownloadProgress from "../../download-progress/download-progress.component";
import DownloadStatus from "../../download-status/download-status.component";

import "./video-download.css";

const VideoDownload = (props) => {
  const { video } = props;
  const { thumbnail } = video;

  var _isMounted = true;
  var videoContext = useContext(VideoDownloadingContext);
  var [socketDownload, setSocketDownload] = useState();
  var [percentageDownload, setPercentageDownload] = useState();
  var [timeDownload, setTimeDownload] = useState();
  var [downloadError, setDownloadError] = useState(false);

  useEffect(() => {
    if (videoContext.currentVideoDownloading.id === video.id) {
      openDownloadSocket();
    }

    return function cleanup() {
      _isMounted = false;
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

  const openDownloadSocket = () => {
    var socket = socketService.createServer();

    socket.on("connection_error", (err) => console.log(error));
    socket.on("disconnect", () => {
      socket.close();
      setSocketDownloadSafe(null);
      videoContext.resetVideoDownloading();
    });
    socket.on("downloadInfos", (percentageDownloadData, timeDownloadData) => {
      console.log({ percentageDownloadData, timeDownloadData });
      setPercentageDownloadSafe(percentageDownloadData);
      setTimeDownloadSafe(timeDownloadData);
    });

    setSocketDownloadSafe(socket);
  };

  const handleDownloadVideo = (convertToMusic) => {
    VideosService.downloadVideo(props.video, convertToMusic)
      .then((videoDownloading) => {
        videoContext.updateVideoDownloading(videoDownloading.id, videoDownloading.videoId);
        props.onDownloadVideo();
        setDownloadErrorSafe(videoDownloading.error);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeleteVideoDownloaded = async () => {
    const status = await VideosService.deleteVideo(video);

    if (status == 200) {
      props.onDeleteVideo();
    } else {
      alert(`Error while deleting video : ${video.title}`);
    }
  };

  const videoIsDownloading = () => {
    return socketDownload !== null && socketDownload !== undefined;
  };

  return (
    <div className='video-download'>
      <img
        className='video-thumbnail'
        style={{
          height: thumbnail.height,
          width: thumbnail.width,
        }}
        src={thumbnail.url}
      />
      <div className='video-informations'>
        <span className='video-title'>{video.title}</span>
        <span className='video-channel'>{video.channelTitle}</span>
        <div className='download-informations'>
          {videoIsDownloading() ? (
            <DownloadProgress percentageDownload={percentageDownload} timeDownload={timeDownload} />
          ) : (
            <DownloadStatus downloadDate={video.date} downloadError={downloadError} />
          )}
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
          <Button variant='outlined' color='secondary' className='delete-btn' onClick={handleDeleteVideoDownloaded}>
            <CancelIcon />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoDownload;
