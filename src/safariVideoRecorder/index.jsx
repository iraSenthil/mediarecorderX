import React from "react";
import "./Container.css";
import MediaRecorder from "./mediaRecorder";

export default function Container() {
  return (
    <div className="center-me">
      <div>
        <MediaRecorder />
      </div>
    </div>
  );
}
