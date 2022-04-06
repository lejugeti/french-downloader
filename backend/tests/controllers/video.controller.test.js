const videoDataService = require("../../services/video-data.service");
const VideoController = require("../../controllers/videos.controller");
const downloadVideoService = require("../../services/download-video.service");
const socketService = require("../../services/socket.service");

describe("Video controller", () => {
  beforeAll(() => {
    var spySaveData = jest.spyOn(videoDataService, "saveData").mockImplementation(jest.fn());
    var spyDownloadVideo = jest.spyOn(downloadVideoService, "downloadVideo").mockImplementation(jest.fn());
    var spySocket = jest.spyOn(socketService, "getSocket").mockImplementation(jest.fn());
  });

  test("handleDownloadVideo", async () => {
    videoDataService.videos = [
      { id: 0, videoId: "videoId", date: "2022-3-26 18:05:46", error: false, isDownloaded: false },
      { id: 1, videoId: "videoId", date: "2022-3-26 18:05:45", error: false, isDownloaded: false },
      { id: 2, videoId: "videoId2", date: "2022-3-26 18:05:45", error: false, isDownloaded: false },
    ];

    const rawVideo = { videoId: "videoIdKek", isDownloaded: false };
    const notDownloadedVideo = { id: 2, videoId: "videoId2", isDownloaded: false };

    const newVideo1 = VideoController.handleDownloadVideo(rawVideo, true);
    const newVideo2 = VideoController.handleDownloadVideo(notDownloadedVideo, true);

    expect(newVideo1.id).toBe(3);
    expect(videoDataService.videos.length).toBe(4);
  });
});
