import React, { useState, useEffect } from "react";
import Houndify from "houndify";

const RECORDER_STATUS = {
  STARTED: "STARTED",
  PROCESSING: "PROCESSING",
  ENDED: "ENDED",
  ERRORED: "ERRORED",
  READY: "READY",
};

function Recorder({
  clientId,
  conversationState,
  authenticationEndpoint,
  requestInfo,
  onTranscriptionUpdate,
  onResponse,
  onError,
  debug,
}) {
  const recorder = new Houndify.AudioRecorder();
  let voiceRequest;
  const [status, setStatus] = useState(RECORDER_STATUS.READY);

  recorder.on("start", function() {
    setStatus(RECORDER_STATUS.STARTED);
    voiceRequest = new Houndify.VoiceRequest({
      //Your Houndify Client ID
      clientId,

      //For testing environment you might want to authenticate on frontend without Node.js server.
      //In that case you may pass in your Houndify Client Key instead of "authURL".
      //clientKey: "YOUR_CLIENT_KEY",

      //Otherwise you need to create an endpoint on your server
      //for handling the authentication.
      //See SDK's server-side method HoundifyExpress.createAuthenticationHandler().
      authURL: authenticationEndpoint,

      //REQUEST INFO JSON
      //See https://houndify.com/reference/RequestInfo
      requestInfo,

      //Pass the current ConversationState stored from previous queries
      //See https://www.houndify.com/docs#conversation-state
      conversationState,

      //Sample rate of input audio
      sampleRate: recorder.sampleRate,

      //Enable Voice Activity Detection
      //Default: true
      enableVAD: true,

      //Partial transcript, response and error handlers
      onTranscriptionUpdate: onTranscriptionUpdate,
      onResponse: function(response, info) {
        recorder.stop();
        onResponse(response, info);
      },
      onError: function(err, info) {
        recorder.stop();
        onError(err, info);
      },
    });
  });

  recorder.on("data", function(data) {
    setStatus(RECORDER_STATUS.PROCESSING);
    voiceRequest.write(data);
  });

  recorder.on("end", function() {
    setStatus(RECORDER_STATUS.ENDED);
  });

  recorder.on("error", function(error) {
    setStatus(RECORDER_STATUS.ERRORED);
  });

  function handleMicrophoneClick() {
    if (recorder && recorder.isRecording()) {
      recorder.stop();
      return;
    }

    recorder.start();
  }

  return (
    <>
      <div className="recorder bg-red p-6" onClick={handleMicrophoneClick}>
        Microphone
      </div>
      {debug && <div>Recorder status: {status}</div>}
    </>
  );
}

export default Recorder;
