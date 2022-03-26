var express = require("express");
const queryString = require("query-string");

var router = express.Router();
var videoController = require("../controllers/videos.controller");

router.get("/", function (req, res, next) {
  const videos = videoController.getVideosDownloaded();
  res.status(200);
  res.send(videos);
});

router.post("/download", function (req, res, next) {
  const video = req.body;
  const params = queryString.parse(req._parsedUrl.query, {
    parseBooleans: true,
  });

  videoController
    .downloadVideo(video, params.convertToMusic)
    .then((code) => {
      res.status(200);
      res.send("Video downloaded");
    })
    .catch((error) => {
      next(error);
    });
});

router.delete("/", function (req, res, next) {
  const params = req.query;

  videoController
    .deleteVideo(params.videoId, params.date)
    .then(() => {
      res.status(200);
      res.send();
    })
    .catch((error) => next(error));
});

module.exports = router;
