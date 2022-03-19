const axios = require("axios").default;
const apiUrl = "http://localhost:8080/videos/";

const YoutubeDownloadService = {
  downloadVideo: function (videoId, convertToMusic) {
    const downloadUrl = apiUrl + videoId + "/download";

    const params = new URLSearchParams();
    params.append("convertToMusic", convertToMusic);

    const config = { params };
    return axios.get(downloadUrl, config);
  },
};

export default YoutubeDownloadService;
