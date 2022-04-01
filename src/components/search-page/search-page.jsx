import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import VideoResult from "./video-result/video-result.component";

import "./search-page.css";
import YoutubeService from "../../services/youtube.service";
import videosService from "../../services/videos.service";

const SearchPage = function (props) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [videoIdListDownloaded, setVideoIdListDownloaded] = useState([]);

  const searchVideos = async (query) => {
    if (query !== "") {
      try {
        const videosQueried = await YoutubeService.searchVideos(query);
        const videoAlreadyDownloaded = await videosService.getVideosDownloadedFilteredById(
          videosQueried.map((video) => video.id.videoId)
        );
        setVideoIdListDownloaded(videoAlreadyDownloaded.map((video) => video.videoId));
        setSearchResult(videosQueried);
      } catch (error) {
        console.error(err);
        // TODO : mettre popup error
      }
    }
  };

  const handleEnterKeySearch = (keyEvent) => {
    if (keyEvent.key === "Enter") {
      searchVideos(query);
    }
  };

  const videoIsDownloaded = (videoId) => {
    return videoIdListDownloaded.includes(videoId);
  };

  return (
    <div className='search-page'>
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
      <div className='search-results'>
        {searchResult.map((video) => (
          <VideoResult key={video.id.videoId} video={video} alreadyDownloaded={videoIsDownloaded(video.id.videoId)} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
