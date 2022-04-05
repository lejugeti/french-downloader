import React, { useState, useContext, useEffect } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadContext from "../../../contexts/download.context";
import VideosService from "../../../services/videos.service";

import DownloadProgress from "../../download-progress/download-progress.component";
import DownloadStatus from "../../download-status/download-status.component";

import "./video-download.css";

const VideoDownload = ({ video, onDownloadVideo, onVideoDownloaded, onDeleteVideo }) => {
  const { thumbnail } = video;

  var _isMounted = true;
  var downloadContext = useContext(DownloadContext);

  useEffect(() => {
    if (!video.isDownloaded) {
      downloadContext.socket.on("download-ended", (videoId, isDownloaded) => {
        if (downloadContext.videoId === video.id) {
          onVideoDownloaded(videoId, isDownloaded);
        }
      });
    }
  }, []);

  const handleDownloadVideo = (convertToMusic) => {
    VideosService.downloadVideo(video, convertToMusic)
      .catch((error) => {
        console.log(error);
      })
      .finally(async () => {
        await onDownloadVideo();
      });
  };

  const handleDeleteVideoDownloaded = async () => {
    const status = await VideosService.deleteVideo(video);

    if (status == 200) {
      onDeleteVideo();
    } else {
      alert(`Error while deleting video : ${video.title}`);
    }
  };

  const videoIsDownloading = () => {
    return downloadContext.videoId === video.id;
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
          {videoIsDownloading() && (
            <DownloadProgress
              percentageDownload={downloadContext.percentageDownload}
              timeDownload={downloadContext.timeDownload}
            />
          )}
          {video.isDownloaded && <DownloadStatus downloadDate={video.date} downloadError={video.error} />}
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
