import React, { useState } from "react";
import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import VideoResult from "./video-result/video-result.component";

import "./search-page.css";
import YoutubeService from "../../services/youtube.service";

const SearchPage = function (props) {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

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
    <div className='search-page'>
      <TextField
        id='outlined-basic'
        label='Recherche'
        variant='outlined'
        style={{ width: "50em" }}
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
          <VideoResult key={video.id.videoId} video={video} />
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
