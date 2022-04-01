const videoControllerPath = "../../controllers/videos.controller";
const socketService = require("../../services/socket.service");
const videoDataService = require("../../services/video-data.service");
var videoController = require(videoControllerPath);

jest.mock("../../services/video-data.service");

describe("Video controller", () => {
  beforeAll(() => {
    videoController.setSocket(socketService.createSocket());
  });

  test("Download video - code 0", async () => {
    var spyVideoController = jest
      .spyOn(videoController, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(0));

    var code = await videoController.downloadVideo({ videoId: "videoId" }, true);
    expect(code).toBe(0);
  });

  test("Download video - code 500", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(videoController, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(500));

    try {
      var code = await videoController.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(500);
    }
  });

  test("Download video - 403 retry", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(videoController, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(403).mockReturnValueOnce(0));

    var code = await videoController.downloadVideo({ videoId: "videoId" }, true);
    expect(code).toBe(0);
  });

  test("Download video - 403 retry with error", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(videoController, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(403).mockReturnValueOnce(500));

    try {
      var code = await videoController.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(500);
    }
  });

  test("Download video - too much 403 retry", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(videoController, "spawnDownloadScript")
      .mockImplementation(
        jest
          .fn()
          .mockReturnValueOnce(403)
          .mockReturnValueOnce(403)
          .mockReturnValueOnce(403)
          .mockReturnValueOnce(403)
          .mockReturnValueOnce(403)
      );

    try {
      var code = await videoController.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(403);
    }
  });

  test("Parse percentage", () => {
    expect(videoController.parseDownloadPercentage("68.5% of total video")).toBe("68.5%");
    expect(videoController.parseDownloadPercentage("[download]  68.5% of total video")).toBe("68.5%");
    expect(videoController.parseDownloadPercentage("[download]  62.55% of total video")).toBe("62.55%");
    expect(videoController.parseDownloadPercentage("[download]  62.% of total video")).toBe("62.%");
    expect(videoController.parseDownloadPercentage("[download] of total video")).toBe(null);
  });

  test("Parse http code", () => {
    expect(videoController.parseHttpErrorCode("HTTP 403")).toBe(403);
    expect(videoController.parseHttpErrorCode("HTTP 403 video")).toBe(403);
    expect(videoController.parseHttpErrorCode("[download]  403.110 of total video")).toBe(null);
  });

  test("Parse download time", () => {
    expect(videoController.parseDownloadTime("52.24KiB/s ETA 00:03")).toBe("00:03");
    expect(videoController.parseDownloadTime("52.24KiB/s ETA 00:03 ")).toBe("00:03");
    expect(videoController.parseDownloadTime("52.24KiB/s ETA 100:03")).toBe(null);
  });

  test("Is download informations", () => {
    expect(videoController.isDownloadInfos("52.24KiB/s ETA 00:03")).toBeTruthy();
    expect(videoController.isDownloadInfos("68.5% blabla ")).toBeTruthy();
    expect(videoController.isDownloadInfos("52.24KiB/s ETA 100")).toBeFalsy();
  });
});
