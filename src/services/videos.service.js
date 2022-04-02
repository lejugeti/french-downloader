const axios = require("axios").default;
const qs = require("qs");
const apiUrl = "http://localhost:8080/videos";

class VideosService {
  async getVideosDownloaded() {
    const result = await axios({
      method: "get",
      url: apiUrl,
    });

    return result.data;
  }

  async deleteVideo(video) {
    const params = {
      videoId: video.videoId,
      date: video.date,
    };

    const result = await axios({
      method: "delete",
      url: apiUrl,
      params,
    });

    return result.status;
  }

  async getVideosDownloadedFilteredById(videoIdList) {
    const params = { videoIdList };
    const result = await axios({
      method: "get",
      url: apiUrl,
      params,
      paramsSerializer: (params) => {
        return qs.stringify(params);
      },
    });

    return result.data;
  }

  async deleteVideo(video) {
    const params = {
      videoId: video.videoId,
      date: video.date,
    };

    const result = await axios({
      method: "delete",
      url: apiUrl,
      params,
    });

    return result.status;
  }

  async downloadVideo(video, convertToMusic) {
    const downloadUrl = apiUrl + "/download";

    const params = new URLSearchParams();
    params.append("convertToMusic", convertToMusic);

    const config = { params, data: this.formatVideo(video) };

    var response = await axios({
      method: "post",
      url: downloadUrl,
      data: this.formatVideo(video),
      params,
    });

    return response.data;
  }

  formatVideo(video) {
    if (this.videoIsNotRaw(video)) {
      return {
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        title: video.title,
        channelTitle: video.channelTitle,
        channelId: video.channelId,
      };
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

  videoIsNotRaw(video) {
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
