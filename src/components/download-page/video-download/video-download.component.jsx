import React, { useState, useContext } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import VideosService from "../../../services/videos.service";
import VideoDownloadingContext from "../../../contexts/video-downloading.context";
import socketService from "../../../services/socket.service";

import "./video-download.css";

const VideoDownload = (props) => {
  const { video } = props;
  const { thumbnail } = video;
  var socket;

  var videoContext = useContext(VideoDownloadingContext);
  var [percentageDownload, setPercentageDownload] = useState();
  var [timeDownload, setTimeDownload] = useState();

  const handleDownloadVideo = (convertToMusic) => {
    socket = socketService.createServer();
    socket.on("connection_error", (err) => console.log(error));
    socket.on("disconnect", () => {
      socket.close();
      socket = null;
    });
    socket.on("downloadInfos", (percentageDownloadData, timeDownloadData) => {
      console.log({ percentageDownloadData, timeDownloadData });
      setPercentageDownload(percentageDownloadData);
      setTimeDownload(timeDownloadData);
    });

    VideosService.downloadVideo(props.video, convertToMusic)
      .then(() => {
        props.onDownloadVideo();
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

  const renderDownloadStatus = () => {
    if (video.error) {
      return (
        <span className='download-status-ERROR'>
          Download Error
          <ErrorIcon />
        </span>
      );
    } else {
      return (
        <span className='download-status-OK'>
          Download Success
          <CheckCircleIcon />
        </span>
      );
    }
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
          {renderDownloadStatus()}
          <span className='download-date'>{video.date}</span>
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
