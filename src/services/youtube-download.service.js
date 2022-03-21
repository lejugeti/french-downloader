const axios = require("axios").default;
const apiUrl = "http://localhost:8080/videos";

class YoutubeDownloadService {
  downloadVideo(video, convertToMusic) {
    console.log(video);
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
    return {
      videoId: video.id.videoId,
      thumbnail: video.snippet.thumbnails.medium,
      title: video.snippet.title,
      channelTitle: video.snippet.channelTitle,
      channelId: video.snippet.channelId,
    };
  }
}

export default new YoutubeDownloadService();
