import React, { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import YoutubeDownloadService from "../../../services/videos.service";
import DownloadContext from "../../../contexts/download.context";

import DownloadProgress from "../../download-progress/download-progress.component";
import DownloadStatus from "../../download-status/download-status.component";

import "./video-result.css";

const VideoResult = ({ video, alreadyDownloaded, previousDownloadError }) => {
  const { id, snippet } = video;
  const { thumbnails } = snippet;

  var _isMounted = true;
  var downloadContext = useContext(DownloadContext);
  var [downloadError, setDownloadError] = useState(false);
  var [downloadDate, setDownloadDate] = useState("");
  var [videoAlreadyDownloaded, setVideoAlreadyDownloaded] = useState(alreadyDownloaded);

  useEffect(() => {
    if (previousDownloadError) {
      setDownloadError(previousDownloadError);
    }

    return function cleanup() {
      _isMounted = false;
    };
  }, []);

  //#region Setters safe
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

  const setVideoAlreadyDownloadedSafe = (isDownloaded) => {
    if (_isMounted) {
      setVideoAlreadyDownloaded(isDownloaded);
    }
  };
  //#endregion

  const handleDownloadVideo = (convertToMusic) => {
    downloadContext.socket.once("download-ended", () => {
      setVideoAlreadyDownloadedSafe(true);
    });

    YoutubeDownloadService.downloadVideo(video, convertToMusic)
      .then((videoDownloading) => {
        setDownloadErrorSafe(videoDownloading.error);
        setDownloadDateSafe(videoDownloading.date);
      })
      .catch((error) => console.log(error));
  };

  const videoIsDownloading = () => {
    return downloadContext.videoYoutubeId === video.id.videoId;
  };

  const showDownloadStatus = () => {
    return !videoIsDownloading() && videoAlreadyDownloaded;
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
            <DownloadProgress
              percentageDownload={downloadContext.percentageDownload}
              timeDownload={downloadContext.timeDownload}
            />
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
