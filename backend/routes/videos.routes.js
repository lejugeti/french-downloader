var express = require("express");
const queryString = require("query-string");

var router = express.Router();
var VideoController = require("../controller/videos.controller");

router.get("/:id/download", function (req, res, next) {
  const videoId = req.params.id;
  const params = queryString.parse(req._parsedUrl.query, {
    parseBooleans: true,
  });

  VideoController.downloadVideo(videoId, params.convertToMusic)
    .then((code) => {
      res.status(200);
      res.send("Video downloaded");
    })
    .catch((error) => {
      res.status(500);
      res.send(error.message);
    });
});

module.exports = router;
