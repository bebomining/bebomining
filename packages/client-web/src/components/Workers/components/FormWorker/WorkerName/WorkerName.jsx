import React from "react";
import { TextField } from "./../../../../TextField/TextField";

export function WorkerName() {
  return (
    <div style={{ maxWidth: "624px", padding: "0 24px", margin: "auto" }}>
      <TextField
        autoFocus={true}
        touched={true}
        helperText="Accept letters, numbers and [#-_]...{2,50}"
        validators={[isValidName]}
        label="Type Worker Name..."
        variant="outlined"
        name="workerName"
      />
    </div>
  );
}

const isValidName = value =>
  value && /^[a-zA-Z][a-zA-Z0-9#\-_]{2,50}$/.test(value)
    ? undefined
    : "Name not valid";
