import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Houndify from "houndify";

// Local Components
import Recorder from "./Recorder";
import Textbox from "./Textbox";
import Response from "./Response";

function HoundifyUI({ clientId, authenticationEndpoint, debug }) {
  const [query, setQuery] = useState("");
  const [convoState, setConvoState] = useState({});
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);

  const [requestInfo, setRequestInfo] = useState({
    UserID: "test_user",
    Latitude: 37.388309,
    Longitude: -121.973968,
  });

  return (
    <div>
      <Recorder
        clientId={clientId}
        requestInfo={requestInfo}
        conversationState={convoState}
        authenticationEndpoint={authenticationEndpoint}
        onTranscriptionUpdate={transcript =>
          setQuery(transcript.PartialTranscript)
        }
        onError={error => {
          console.log(error);
        }}
        onResponse={(response, info) => {
          console.log(response);
        }}
        debug={debug}
      />
      <Textbox
        clientId={clientId}
        requestInfo={requestInfo}
        conversationState={convoState}
        authenticationEndpoint={authenticationEndpoint}
        onError={error => {
          setError(error);
        }}
        onResponse={(response, info) => {
          setResponse(response);
        }}
        onQueryChange={q => setQuery(q)}
        query={query}
        debug={debug}
      />

      {debug && <Response payload={response} error={error} />}
    </div>
  );
}

const domContainer = document.querySelector("#houndify-ui");
ReactDOM.render(
  <HoundifyUI
    clientId="zNN-g0aPBl41pvf8plH0aw=="
    authenticationEndpoint="/houndifyAuth"
    debug={true}
  />,
  domContainer,
);
