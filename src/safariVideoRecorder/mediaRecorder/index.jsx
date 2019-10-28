import React, { useEffect, useRef, useState } from "react";

function MediaRecorder() {
  const mediaRecorderRef = useRef();
  const videoControlRef = useRef();
  const streamRef = useRef();
  const chunksRef = useRef([]);

  const [error, setError] = useState();
  const [recording, setRecording] = useState(false);
  const [initilialized, setInitialized] = useState(false);
  const [videoFile, setVideoFile] = useState();

  function initMediaRecorder() {
    const handleSuccess = stream => {
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      streamRef.current = stream;
      mediaRecorderRef.current.ondataavailable = function(e) {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = function() {
        const blob = new Blob(chunksRef.current);
        chunksRef.current = [];

        const videoUrl = window.URL.createObjectURL(blob);
        const rand = Math.floor(Math.random() * 10000000);
        const name = "video_" + rand + ".mp4";
        setVideoFile({ name, videoUrl });
      };

      setInitialized(true);
    };

    const handleFaileure = err => {
      setError({ error: err });
    };

    const videoConstrains = {
      audio: true,
      video: {
        width: { exact: 240 },
        height: { exact: 320 },
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
      if (videoFile) {
        URL.revokeObjectURL(videoFile.videoUrl);
      }
      setVideoFile(undefined);
    }
  }

  if (error) {
    return <div>Error : {JSON.stringify(error)}</div>;
  }

  if (!initilialized) {
    return <div>Instructions to enable exprimental settings.</div>;
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

      {videoFile && (
        <>
          <div>
            <a
              href={videoFile.videoUrl}
              download={videoFile.name}
              name={videoFile.name}
            >
              Download
            </a>
          </div>
          <video controls src={videoFile.videoUrl} />
        </>
      )}
    </div>
  );
}

export default MediaRecorder;
