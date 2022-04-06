import React, { useState, useEffect, useContext } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import VideoDownload from "./video-download/video-download.component";
import videosService from "../../services/videos.service";
import DownloadContext from "../../contexts/download.context";

import "./download-page.css";

const DownloadPage = function (props) {
  const [videosDownloaded, setVideosDownloaded] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  var downloadContext = useContext(DownloadContext);

  useEffect(() => {
    refreshVideosDownloaded();

    downloadContext.socket.on("download-ended", (videoId, isDownloaded) => {
      refreshVideosDownloaded();
      // onVideoDownloaded(videoId, isDownloaded);
    });
  }, []);

  const refreshVideosDownloaded = async () => {
    const videos = await videosService.getVideosDownloaded();
    console.log({ refresh: videos });
    setVideosDownloaded(videos);
  };

  const searchVideos = (query) => {
    if (query !== "") {
      YoutubeService.searchVideos(query)
        .then((res) => {
          console.log(res);
          setSearchResult(res.data.items);
        })
        .catch((err) => console.error(err));
    }
  };

  const handleEnterKeySearch = (keyEvent) => {
    if (keyEvent.key === "Enter") {
      searchVideos(query);
    }
  };

  const onVideoDownloaded = async (videoId, isDownloaded) => {
    let newVideoDownloaded = await videosService.getVideosDownloaded();
    // console.log({ newVideoDownloaded });

    newVideoDownloaded.find((video) => video.id === videoId).isDownloaded = isDownloaded;
    setVideosDownloaded(newVideoDownloaded);
  };

  return (
    <div className='download-page'>
      <TextField
        id='outlined-basic'
        label='Recherche'
        variant='outlined'
        style={{ width: "56em" }}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end' onClick={() => searchVideos(query)}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        onChange={(newQuery) => setQuery(newQuery.target.value)}
        onKeyDown={handleEnterKeySearch}
      />
      <div className='download-results'>
        {videosDownloaded
          .map((video, index) => (
            <VideoDownload
              key={index}
              video={video}
              onDownloadVideo={refreshVideosDownloaded}
              onVideoDownloaded={(videoId, isDownloaded) => onVideoDownloaded(videoId, isDownloaded)}
              onDeleteVideo={refreshVideosDownloaded}
            />
          ))
          .sort((v1, v2) => v2.props.video.id - v1.props.video.id)}
      </div>
    </div>
  );
};

export default DownloadPage;
