const axios = require("axios").default;
const apiUrl = "http://localhost:8080/videos";

class VideosService {
  async getVideosDownloaded() {
    const downloadUrl = apiUrl;

    const result = await axios({
      method: "get",
      url: downloadUrl,
    });

    return result.data;
  }

  downloadVideo(video, convertToMusic) {
    const downloadUrl = apiUrl + "/download";

    const params = new URLSearchParams();
    params.append("convertToMusic", convertToMusic);

    const config = { params, data: this.formatVideo(video) };
    return axios({
      method: "post",
      url: downloadUrl,
      data: this.formatVideo(video),
      params,
    });
  }

  formatVideo(video) {
    if (this.videoIsAlreadyFormated(video)) {
      return video;
    } else {
      return {
        videoId: video.id.videoId,
        thumbnail: video.snippet.thumbnails.medium,
        title: video.snippet.title,
        channelTitle: video.snippet.channelTitle,
        channelId: video.snippet.channelId,
      };
    }
  }

  videoIsAlreadyFormated(video) {
    return (
      video.hasOwnProperty("videoId") &&
      video.hasOwnProperty("thumbnail") &&
      video.hasOwnProperty("title") &&
      video.hasOwnProperty("channelTitle") &&
      video.hasOwnProperty("channelId")
    );
  }
}

export default new VideosService();
