import React from "react";
import YoutubeService from "../services/youtube.service.ts";

function Welcome(props) {
  React.useEffect(
    () => YoutubeService.searchVideos("muse").then((data) => console.log(data)),
    []
  );
  return <h1>Bonjour, Antman</h1>;
}

export default Welcome;
