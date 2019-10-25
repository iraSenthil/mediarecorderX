import React, { useEffect, useRef, useState } from "react";

function MediaRecorder() {
  debugger;
  const mediaRecorderRef = useRef();
  const videoControlRef = useRef();
  const streamRef = useRef();
  const [error, setError] = useState();
  const [recorderStarted, setRecorderStarted] = useState();

  function initMediaRecorder() {
    const handleSuccess = stream => {
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current.ondataavailable = function(...args) {
        console.info("ondataavailable", args);
      };

      setRecorderStarted(true);
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
    initMediaRecorder();
  }, []);

  useEffect(() => {
    if (streamRef.current && videoControlRef.current) {
      videoControlRef.current.srcObject = streamRef.current;
    }
  });
  return (
    <>
      {error && <div>Error : {JSON.stringify(error)}</div>}
      {recorderStarted && (
        <video autoPlay muted preload="preload" ref={videoControlRef} />
      )}
    </>
  );
}

export default MediaRecorder;
