const axios = require("axios").default;
const apikey = process.env.REACT_APP_YOUTUBE_API_KEY;

const apiUrls = { search: "https://youtube.googleapis.com/youtube/v3/search" };

const YoutubeService = {
  searchVideos: async function (query) {
    const responseType = "json";
    const params = new URLSearchParams();
    params.append("part", "id");
    params.append("part", "snippet");
    params.append("q", query);
    params.append("maxResults", 15);
    params.append("type", "video");
    params.append("key", apikey);

    const config = { params, responseType };
    const result = await axios.get(apiUrls.search, config);

    return result.data.items;
  },
};

export default YoutubeService;
