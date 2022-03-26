import React, { useState, useEffect } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import VideoDownload from "./video-download/video-download.component";
import videosService from "../../services/videos.service";

import "./download-page.css";

const DownloadPage = function (props) {
  const [videosDownloaded, setVideosDownloaded] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    refreshVideosDownloaded();
  }, []);

  const refreshVideosDownloaded = () => {
    videosService.getVideosDownloaded().then((videos) => {
      setVideosDownloaded(videos);
    });
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
        {videosDownloaded.map((video, index) => (
          <VideoDownload key={index} video={video} onDownloadVideo={refreshVideosDownloaded} />
        ))}
      </div>
    </div>
  );
};

export default DownloadPage;
