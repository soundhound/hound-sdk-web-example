import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

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
    Longitude: -121.973968
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="p-6 m-auto bg-white max-w-lg min-h-screen">
        <h1 className="text-xl font-bold">Houndify SDK React Example</h1>
        <p className="py-2">
          The Houndify JavaScript SDK can be used with React. Here are some
          components to help you get started.
        </p>

        <h2 className="text-lg pt-6 font-bold">Using these components</h2>
        <p className="py-2">
          These components are still in beta and have not been released on npm.
          To use them in your project, follow the following steps:
        </p>
        <ul className="list-decimal ml-6">
          <li>Install the dependencies.</li>
          <li>
            npm install react react-dom houndify styled-components framer-motion
          </li>
          <li>
            Copy the appropriate component file from the{" "}
            <a
              className="text-blue-500"
              href="https://github.com/soundhound/hound-sdk-web-example/tree/react/src/components"
            >
              Github repository
            </a>
            .
          </li>
        </ul>

        <h2 className="text-lg pt-6 font-bold">Recorder</h2>
        <p className="py-2">
          The Recorder component lets you accept voice recordings and pass them
          to the Houndify API.
        </p>
        <div className="py-6">
          <Recorder
            clientId={clientId}
            requestInfo={requestInfo}
            conversationState={convoState}
            authenticationEndpoint={authenticationEndpoint}
            onTranscriptionUpdate={transcript =>
              setQuery(transcript.PartialTranscript)
            }
            onError={error => {
              setError(error);
            }}
            onResponse={(response, info) => {
              setConvoState(response.AllResults[0].ConversationState);
              setResponse(response);
            }}
            enableVAD
            debug={false}
          />
        </div>

        <h2 className="text-md pt-6 font-bold">PropTypes</h2>
        <p>
          The Recorder component accepts the following props. They generally map
          to all the options that need to be passed into the{" "}
          <a
            className="text-blue-500"
            href="https://docs.houndify.com/sdks/docs/javascript#sending-voice-requests-with-houndifyvoicerequest-"
          >
            Houndify.VoiceRequest constructor
          </a>
          .
        </p>

        <ul className="list-disc ml-6 pt-4">
          <li>clientId: The Houndify client ID </li>
          <li>
            requestInfo: The RequestInfo object that you want to pass into the
            voice request.{" "}
          </li>
          <li>
            conversationState: The conversation state object that you want to
            pass into the voice request. By default, this is an empty object.
          </li>
          <li>
            authenticationEndpoint: The authentication endpoint on the server
            that should be hit to generate the Authentication signature.
          </li>
          <li>
            onTranscriptionUpdate(transcript): A function that will be called
            with real-time transcriptions as a user speaks into the microphone.
          </li>
          <li>
            onResponse(response, info): A function that will be called with the
            final response object.{" "}
          </li>
          <li>
            onError(error): A function that will be called if an error occurs
            with the error object.
          </li>
          <li>
            enableVAD: Determines whether or not voice activity detection should
            be enabled or not.
          </li>
          <li>
            debug: Set this to true to render out a status bar into the UI
          </li>
        </ul>

        <h2 className="text-lg pt-6 font-bold">Textbox</h2>
        <p className="py-2">
          The Textbox component lets you accept text queries and pass them to
          the Houndify API.
        </p>

        <div className="py-6">
          <Textbox
            clientId={clientId}
            requestInfo={requestInfo}
            conversationState={convoState}
            authenticationEndpoint={authenticationEndpoint}
            onError={error => {
              setError(error);
            }}
            onResponse={(response, info) => {
              setConvoState(response.AllResults[0].ConversationState);
              setResponse(response);
            }}
            onQueryChange={q => setQuery(q)}
            query={query}
            proxy={{
              method: "POST",
              url: "/textSearchProxy"
              // headers: {}
              // ... More proxy options will be added as needed
            }}
            debug={debug}
          />
        </div>

        <ul className="list-disc ml-6 pt-4">
          <li>clientId: The Houndify client ID </li>
          <li>
            clientKey: We do not recommend exposing your client key, but if you
            don't specify a text proxy, you can enter a Client Key to make
            requests without a server dependency.
          </li>
          <li>
            requestInfo: The RequestInfo object that you want to pass into the
            voice request.{" "}
          </li>
          <li>
            conversationState: The conversation state object that you want to
            pass into the voice request. By default, this is an empty object.
          </li>
          <li>
            authenticationEndpoint: The authentication endpoint on the server
            that should be hit to generate the Authentication signature.
          </li>
          <li>
            onQueryChange(query): A function that will be called as a user types
            into the input box.
          </li>
          <li>
            onResponse(response, info): A function that will be called with the
            final response object.{" "}
          </li>
          <li>
            onError(error): A function that will be called if an error occurs
            with the error object.
          </li>
          <li>
            proxy: An object with properties <code>method</code> and{" "}
            <code>url</code>. Tells the component what URL to hit to proxy
            requests through to the backend.
          </li>
          <li>
            debug: Set this to true to render out a status bar into the UI
          </li>
        </ul>

        {debug && (
          <div className="py-6">
            <h2 className="text-lg pt-6 font-bold">Response</h2>
            <p className="py-2">
              The Response component lets you visualize Houndify API Responses
              in a stringified JSON format.
            </p>
            <Response payload={response} error={error} />
          </div>
        )}
      </div>
    </div>
  );
}

const domContainer = document.querySelector("#houndify-ui");
ReactDOM.render(
  <HoundifyUI
    clientId="YOUR_CLIENT_ID"
    authenticationEndpoint="/houndifyAuth"
    debug={true}
  />,
  domContainer
);
