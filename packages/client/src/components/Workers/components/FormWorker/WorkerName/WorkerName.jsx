import React from "react";
import { TextField } from "./../../../../TextField/TextField";

export function WorkerName() {
  return (
    <TextField
      autoFocus
      helperText="Accept letters, numbers and [#-_]...{2,50}"
      validators={[isValidName]}
      label="Type Worker Name..."
      variant="outlined"
      name="workerName"
    />
  );
}

const isValidName = value =>
  value && /^[a-zA-Z][a-zA-Z0-9#\-_]{2,50}$/.test(value)
    ? undefined
    : "Name not valid";
