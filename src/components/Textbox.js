import React from "react";
import PropTypes from "prop-types";
import Houndify from "houndify";

function makeTextRequest({
  query,
  clientId,
  requestInfo,
  conversationState,
  authenticationEndpoint,
  onResponse,
  onError,
}) {
  //Initialize TextRequest
  var textRequest = new Houndify.TextRequest({
    //Text query
    query,

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

    //You need to create an endpoint on your server
    //for handling the authentication and proxying
    //text search http requests to Houndify backend
    //See SDK's server-side method HoundifyExpress.createTextProxyHandler().
    proxy: {
      method: "POST",
      url: "/textSearchProxy",
      // headers: {}
      // ... More proxy options will be added as needed
    },

    //Response and error handlers
    onResponse: onResponse,
    onError: onError,
  });
}

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
}) {
  function onHandleQuery(e) {
    e.preventDefault();
    makeTextRequest({
      query,
      conversationState,
      authenticationEndpoint,
      requestInfo,
      clientId,
      onResponse,
      onError,
    });
  }

  return (
    <form>
      <input
        type="text"
        onChange={e => {
          onQueryChange(e.target.value);
        }}
        value={query}
      ></input>
      <button onClick={onHandleQuery} type="submit">
        Make query
      </button>
    </form>
  );
}

Textbox.propTypes = {
  onQueryChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
};

export default Textbox;
