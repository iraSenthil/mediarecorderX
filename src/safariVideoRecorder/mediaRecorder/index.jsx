import React, { useEffect, useRef, useState } from "react";

function MediaRecorder() {
  const mediaRecorderRef = useRef();
  const videoControlRef = useRef();
  const streamRef = useRef();

  const [error, setError] = useState();
  const [recording, setRecording] = useState(false);
  const [initilialized, setInitialized] = useState(false);

  function initMediaRecorder() {
    const handleSuccess = stream => {
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current.ondataavailable = function(...args) {
        console.info("ondataavailable", args);
      };

      setInitialized(true);
    };

    const handleFaileure = err => {
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
    initMediaRecorder();
  }, []);

  useEffect(() => {
    // Check videoControlRef.current.srcObject to avoid setting it again and again which causes flashing
    if (streamRef.current && !videoControlRef.current.srcObject) {
      videoControlRef.current.srcObject = streamRef.current;
    }
  });

  function handleButtonClick() {
    if (recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    } else {
      mediaRecorderRef.current.start();
      setRecording(true);
    }
  }

  if (error) {
    return <div>Error : {JSON.stringify(error)}</div>;
  }

  if (!initilialized) {
    return <div>Allow Camers and enabled exprimental features</div>;
  }

  return (
    <div>
      <div className="row justify-content-center">
        <video
          style={{ width: "80%" }}
          autoPlay
          muted
          preload="preload"
          playsInline
          ref={videoControlRef}
        />
      </div>

      <div className="py-3 row justify-content-center">
        <button
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary"
        >
          {recording ? "Stop" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default MediaRecorder;
