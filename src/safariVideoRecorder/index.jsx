import React from "react";
import "./Container.css";
import MediaRecorder from "./mediaRecorder";
// App-prefs://prefs:root=Settings&path=Safari
// App-prefs://prefs:root=Privacy&path=LOCATION
export default function Container() {
  return (
    <div className="center-me">
      <div>
        <div>
          <a href="App-Prefs://prefs:root=Settings">Open Settings</a>
        </div>
        <MediaRecorder />
      </div>
    </div>
  );
}
