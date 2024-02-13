import React, { useRef, useEffect, useState } from "react";
import video from "../../assets/Home/animation.webm";
import "./Video.css";

const Video = () => {
  const videoRef = useRef(null);
  const [canPlay, setCanPlay] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    const handleLoadedData = () => {
      setCanPlay(true);
      videoRef.current.play();
    };

    const handleVideoEnded = () => {
      setVideoEnded(true);
      sessionStorage.setItem("videoPlayed", "true");
    };

    if (videoRef.current) {
      videoRef.current.addEventListener("loadeddata", handleLoadedData);
      videoRef.current.addEventListener("ended", handleVideoEnded);

      const videoPlayed = sessionStorage.getItem("videoPlayed");
      if (videoPlayed === "true") {
        setVideoEnded(true);
        videoRef.current.pause();
      }

      videoRef.current.playbackRate = 1.5;
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("loadeddata", handleLoadedData);
        videoRef.current.removeEventListener("ended", handleVideoEnded);
      }
    };
  }, []);

  return (
    <div
      className={`video-container ${videoEnded || isSafari ? "hidden" : ""}`}
    >
      <video
        className="full-width"
        ref={videoRef}
        width="640"
        height="360"
        preload="auto"
        muted
        playsInline
        autoPlay // Add the autoplay attribute
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* {!canPlay && <div>Loading...</div>} */}
    </div>
  );
};

export default Video;
