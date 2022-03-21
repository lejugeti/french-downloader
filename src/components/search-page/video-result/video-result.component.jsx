import React, { useState } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import YoutubeDownloadService from "../../../services/youtube-download.service";

import "./video-result.css";

const VideoResult = (props) => {
  const { id, snippet } = props.video;
  const { thumbnails } = snippet;

  const handleDownloadVideo = (convertToMusic) => {
    YoutubeDownloadService.downloadVideo(props.video, convertToMusic)
      .then()
      .catch((error) => console.log(error));
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
