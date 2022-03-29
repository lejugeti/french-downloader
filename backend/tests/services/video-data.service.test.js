const videoDataService = require("../../services/video-data.service");

describe("Video data service", () => {
  test("Remove video", async () => {
    videoDataService.videos = [
      { videoId: "videoId", date: "2022-3-26 18:05:46", error: false },
      { videoId: "videoId", date: "2022-3-26 18:05:45", error: false },
      { videoId: "videoId2", date: "2022-3-26 18:05:45", error: false },
    ];

    await videoDataService.removeVideo("videoId", "2022-3-26 18:05:45");

    const remainingVideos = videoDataService.videos;
    expect(remainingVideos.length).toBe(2);
    expect(remainingVideos[0].videoId).toBe("videoId");
    expect(remainingVideos[0].date).toBe("2022-3-26 18:05:46");
    expect(remainingVideos[1].videoId).toBe("videoId2");
    expect(remainingVideos[1].date).toBe("2022-3-26 18:05:45");

    expect(() => videoDataService.removeVideo("videoId3", "2022-3-26 18:05:45")).toThrow();
  });

  test("Get videos", () => {
    videoDataService.videos = [
      { id: 0, videoId: "videoId", date: "2022-3-26 18:05:46", error: false },
      { id: 1, videoId: "videoId", date: "2022-3-26 18:05:45", error: false },
      { id: 2, videoId: "videoId2", date: "2022-3-26 18:05:45", error: false },
    ];

    expect(videoDataService.getVideos().length).toBe(3);
  });

  test("Get new video id", () => {
    videoDataService.videos = [
      { id: 0, videoId: "videoId", date: "2022-3-26 18:05:46", error: false },
      { id: 1, videoId: "videoId", date: "2022-3-26 18:05:45", error: false },
      { id: 2, videoId: "videoId2", date: "2022-3-26 18:05:45", error: false },
    ];

    expect(videoDataService.getNewId()).toBe(3);
  });
});
