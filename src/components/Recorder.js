import React, { useState, useEffect } from "react";
import Houndify from "houndify";
import styled from "styled-components";
import { motion } from "framer-motion";

const RECORDER_STATUS = {
  STARTED: "STARTED",
  PROCESSING: "PROCESSING",
  ENDED: "ENDED",
  ERRORED: "ERRORED",
  READY: "READY"
};

const MicrophoneButton = styled(motion.button)`
  border: 12px solid;
  border-color: ${props => (props.active ? "rgb(225, 91, 100)" : "#111")};
  box-shadow: ${props =>
    props.active ? `0 0 15px rgba(225,91,100, 0.8)` : "none"};
  border-radius: 25px;
  height: 50px;
  :focus {
    outline: 0;
  }
  width: 50px;
`;

const StatusText = styled.div`
  font-size: 12px;
  color: #34b734;
  font-family: "Menlo", monospace;
  margin: 1em 0;
  text-transform: uppercase;
`;

function Recorder({
  clientId,
  conversationState,
  authenticationEndpoint,
  requestInfo,
  onTranscriptionUpdate,
  onResponse,
  onError,
  enableVAD,
  debug
}) {
  const recorder = new Houndify.AudioRecorder();
  const [status, setStatus] = useState(RECORDER_STATUS.READY);
  const [query, setQuery] = useState("");
  let voiceRequest;
  let isActive = false;
  if (
    status === RECORDER_STATUS.STARTED ||
    status === RECORDER_STATUS.PROCESSING
  ) {
    isActive = true;
  }

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
      enableVAD,

      //Partial transcript, response and error handlers
      onTranscriptionUpdate: function(transcription) {
        setQuery(transcription.PartialTranscript);
        onTranscriptionUpdate(transcription);
      },
      onResponse: function(response, info) {
        recorder.stop();
        onResponse(response, info);
      },
      onError: function(err, info) {
        recorder.stop();
        onError(err, info);
      }
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
      setStatus(RECORDER_STATUS.ENDED);
      return;
    }

    recorder.start();
  }

  return (
    <div style={{ position: "relative" }}>
      <MicrophoneButton
        onClick={handleMicrophoneClick}
        active={isActive}
        whileHover={{
          scale: 1.1,
          transition: { duration: 0.75, yoyo: Infinity }
        }}
        whileTap={{ scale: 0.9 }}
        animate={isActive ? { scale: 1.1, duration: 0.75 } : { scale: 1.0 }}
        transition={isActive ? { yoyo: Infinity } : {}}
      ></MicrophoneButton>

      <div
        style={{
          position: "absolute",
          display: "inline-block",
          marginTop: 15,
          marginLeft: `1em`,
          color: query.length === 0 ? "#ccc" : "#111"
        }}
      >
        {query.length === 0
          ? "Click the microphone and ask a question."
          : query}
      </div>

      {debug && <StatusText>Recorder status: [{status}]</StatusText>}
    </div>
  );
}

export default Recorder;
