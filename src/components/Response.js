import React, { Component } from "react";

function Response({ payload, error }) {
  return (
    <div>
      <pre>
        <code>{JSON.stringify(payload, null, 2)}</code>
      </pre>
    </div>
  );
}

export default Response;
