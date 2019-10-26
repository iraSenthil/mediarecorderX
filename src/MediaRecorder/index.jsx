import React, { useEffect, useRef, useState } from "react";

function MediaRecorder() {
  const mediaRecorderRef = useRef();
  const videoControlRef = useRef();
  const streamRef = useRef();
  const urlRef = useRef();
  const [error, setError] = useState();
  const [recording, setRecording] = useState();

  function initMediaRecorder() {
    const handleSuccess = stream => {
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current.start(3 * 1000);
      mediaRecorderRef.current.ondataavailable = function(...args) {
        console.info("ondataavailable", args);
      };

      setRecording(true);
    };

    const handleFaileure = err => {
      console.error(err);
      setError({ error: err });
    };

    const videoConstrains = {
      audio: true,
      video: {
        facingMode: "user"
      }
    };

    window.navigator.mediaDevices
      .getUserMedia(videoConstrains)
      .then(handleSuccess)
      .catch(handleFaileure);
  }

  useEffect(() => {
    if (recording) {
      videoControlRef.current.srcObject = streamRef.current;
    }
  });

  function handleButtonClick() {
    if (recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      initMediaRecorder();
    }
  }

  return (
    <div className="cente">
      {error && <div>Error : {JSON.stringify(error)}</div>}
      <div>
        <button
          type="button"
          onClick={handleButtonClick}
          style={{ margin: "0 auto", display: "block" }}
        >
          Start/Stop
        </button>
      </div>
      {recording && (
        <video
          style={{ width: "80vw", height: "50vh" }}
          autoPlay
          muted
          preload="preload"
          playsInline
          ref={videoControlRef}
        />
      )}
    </div>
  );
}

export default MediaRecorder;
