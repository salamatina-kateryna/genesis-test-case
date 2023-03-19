import React, { useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { Spin } from "antd";
import "./VideoJS.scss";

export const VideoJS = (props) => {
  const videoRef = React.useRef(null);
  const { options, getPlayer } = props;

  const [player, setPlayer] = useState(null);

  React.useEffect(() => {
    const src = options?.sources?.find((sources) => sources.src)?.src;
    if (!src || player) return;

    const videoSettings = JSON.parse(
      localStorage.getItem("videoSettings") || "{}"
    );
    const currentTime = videoSettings[src]?.currentTime || 0;

    const newPlayer = videojs(videoRef?.current, options);
    newPlayer.src(options.sources);
    newPlayer.currentTime(currentTime);

    let latestUpdate = Date.now();

    newPlayer.on("progress", () => {
      videoSettings[src] = videoSettings[src] || {};
      videoSettings[src].currentTime = newPlayer.currentTime();

      if (Date.now() - latestUpdate < 1000) return;

      latestUpdate = Date.now();
      localStorage.setItem("videoSettings", JSON.stringify(videoSettings));
    });

    const onKeyDown = ({ code }) => {
      if (!newPlayer) return;
      switch (code) {
        case "KeyQ":
          newPlayer.playbackRate(4);
          break;
        case "KeyA":
          newPlayer.playbackRate(1);
          break;
        case "KeyZ":
          newPlayer.playbackRate(0.25);
          break;
        default:
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown);

    if (getPlayer) getPlayer(newPlayer);

    setPlayer(newPlayer);
  }, [options, player, getPlayer]);

  return (
    <div className="video-wrapper">
      <div data-vjs-player>
        <video
          id="video"
          className="video-js"
          preload="none"
          src={null}
          ref={videoRef}
        ></video>
      </div>
      {!player && (
        <div className="video-load-text">
          <Spin size="large" />
        </div>
      )}
    </div>
  );
};

export default VideoJS;
