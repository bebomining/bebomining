/* eslint-disable react/prop-types */
import React from "react";
import { default as TextFieldMUI } from "@material-ui/core/TextField";
import { useField, useValidation } from "usetheform";

export function TextField({
  name,
  touched = true,
  autoFocus = false,
  validators,
  label,
  variant,
  inputProps
}) {
  const [status, validation] = useValidation(validators);
  const props = useField({
    type: "text",
    name,
    touched,
    ...validation
  });

  const showError = status.error !== undefined;

  return (
    <TextFieldMUI
      fullWidth
      autoFocus={autoFocus}
      label={label}
      variant={variant}
      error={showError}
      inputProps={inputProps}
      {...props}
    />
  );
}
