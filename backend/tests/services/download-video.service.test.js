const socketService = require("../../services/socket.service");
var downloadVideoService = require("../../services/download-video.service");
const videoDataService = require("../../services/video-data.service");

jest.mock("../../services/video-data.service");

describe("Download video service", () => {
  beforeAll(() => {
    socketService.createSocket();

    var spySocket = jest.spyOn(socketService, "getSocket").mockImplementation(jest.fn());
    var spyAddVideoWithError = jest.spyOn(videoDataService, "addVideoWithError").mockImplementation(jest.fn());
  });

  test("Download video - code 0", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(downloadVideoService, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(0));

    var code = await downloadVideoService.downloadVideo({ videoId: "videoId" }, true);
    expect(code).toBe(0);
  });

  test("Download video - code 500", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(downloadVideoService, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(500));

    try {
      var code = await downloadVideoService.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(500);
    }
  });

  test("Download video - 403 retry", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(downloadVideoService, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(403).mockReturnValueOnce(0));

    var code = await downloadVideoService.downloadVideo({ videoId: "videoId" }, true);
    expect(code).toBe(0);
  });

  test("Download video - 403 retry with error", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(downloadVideoService, "spawnDownloadScript")
      .mockImplementation(jest.fn().mockReturnValueOnce(403).mockReturnValueOnce(500));

    try {
      var code = await downloadVideoService.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(500);
    }
  });

  test("Download video - too much 403 retry", async () => {
    var spySpawnDownloadScript = jest
      .spyOn(downloadVideoService, "spawnDownloadScript")
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
      var code = await downloadVideoService.downloadVideo({ videoId: "videoId" }, true);
    } catch (errorCode) {
      expect(errorCode).toBe(403);
    }
  });

  test("Parse percentage", () => {
    expect(downloadVideoService.parseDownloadPercentage("68.5% of total video")).toBe("68.5%");
    expect(downloadVideoService.parseDownloadPercentage("[download]  68.5% of total video")).toBe("68.5%");
    expect(downloadVideoService.parseDownloadPercentage("[download]  62.55% of total video")).toBe("62.55%");
    expect(downloadVideoService.parseDownloadPercentage("[download]  62.% of total video")).toBe("62.%");
    expect(downloadVideoService.parseDownloadPercentage("[download] of total video")).toBe(null);
  });

  test("Parse http code", () => {
    expect(downloadVideoService.parseHttpErrorCode("HTTP 403")).toBe(403);
    expect(downloadVideoService.parseHttpErrorCode("HTTP 403 video")).toBe(403);
    expect(downloadVideoService.parseHttpErrorCode("[download]  403.110 of total video")).toBe(null);
  });

  test("Parse download time", () => {
    expect(downloadVideoService.parseDownloadTime("52.24KiB/s ETA 00:03")).toBe("00:03");
    expect(downloadVideoService.parseDownloadTime("52.24KiB/s ETA 00:03 ")).toBe("00:03");
    expect(downloadVideoService.parseDownloadTime("52.24KiB/s ETA 100:03")).toBe(null);
  });

  test("Is download informations", () => {
    expect(downloadVideoService.isDownloadInfos("52.24KiB/s ETA 00:03")).toBeTruthy();
    expect(downloadVideoService.isDownloadInfos("68.5% blabla ")).toBeTruthy();
    expect(downloadVideoService.isDownloadInfos("52.24KiB/s ETA 100")).toBeFalsy();
  });
});
