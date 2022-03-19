const axios = require("axios").default;
const apikey = process.env.REACT_APP_YOUTUBE_API_KEY;

const apiUrls = { search: "https://youtube.googleapis.com/youtube/v3/search" };

const YoutubeService = {
  searchVideos: function (query) {
    const responseType = "json";
    const params = new URLSearchParams();
    params.append("part", "id");
    params.append("part", "snippet");
    params.append("q", query);
    params.append("key", "AIzaSyA08kwYPP9yxYkwXHl5FSujdCuqFFqmNUg");

    const config = { params, responseType };

    return axios.get(apiUrls.search, config);
  },
};

export default YoutubeService;
