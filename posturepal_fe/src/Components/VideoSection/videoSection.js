import React from "react";

const VideoSection = () => {
  return (
    <div className="relative w-full h-0 pb-[56.25%] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source
          src="https://cdn.autonomous.ai/production/ecm/240712/Pod_Video_03_Shorten.webm"
          type="video/webm"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoSection;
