import React from "react";
import PropTypes from "prop-types";
import Houndify from "houndify";
import styled from "styled-components";
import { motion } from "framer-motion";
function makeTextRequest({
  query,
  clientId,
  requestInfo,
  conversationState,
  authenticationEndpoint,
  onResponse,
  onError,
  proxy,
  clientKey
}) {
  //Initialize TextRequest
  new Houndify.TextRequest({
    //Text query
    query,

    //Your Houndify Client ID
    clientId,

    //For testing environment you might want to authenticate on frontend without Node.js server.
    //In that case you may pass in your Houndify Client Key instead of "authURL".
    clientKey,

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

    //You need to create an endpoint on your server
    //for handling the authentication and proxying
    //text search http requests to Houndify backend
    //See SDK's server-side method HoundifyExpress.createTextProxyHandler().
    proxy,

    //Response and error handlers
    onResponse: onResponse,
    onError: onError
  });
}

const InputBox = styled.input`
  border: 1px solid #f2f2f2;
  padding: 0.5em 1em;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  border-top-left-radius: 0.5em;
  border-bottom-left-radius: 0.5em;
`;

const InputButton = styled(motion.button)`
  background: #111;
  color: white;
  padding: 0.5em 1em;
  border-top-right-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
`;

function Textbox({
  onQueryChange,
  onClick,
  query,
  onResponse,
  onError,
  conversationState,
  authenticationEndpoint,
  requestInfo,
  clientId,
  clientKey,
  proxy
}) {
  function onHandleQuery(e) {
    e.preventDefault();
    makeTextRequest({
      query,
      conversationState,
      authenticationEndpoint,
      requestInfo,
      clientId,
      clientKey,
      proxy,
      onResponse,
      onError
    });
  }

  return (
    <form>
      <InputBox
        type="text"
        placeholder="Enter a text query"
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        value={query}
      ></InputBox>
      <InputButton
        onClick={onHandleQuery}
        type="submit"
        whileHover={{ scale: 1.1 }}
      >
        →
      </InputButton>
    </form>
  );
}

Textbox.propTypes = {
  onQueryChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired
};

export default Textbox;
