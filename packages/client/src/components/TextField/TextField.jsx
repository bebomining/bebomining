import React from "react";
import { default as TextFieldMUI } from "@material-ui/core/TextField";
import { useField, useValidation } from "usetheform";

export function TextField({
  name,
  index,
  initValue,
  touched = true,
  validators,
  label,
  variant,
  inputProps,
  helperText,
  autoFocus,
  className,
  inputRef
}) {
  const [status, validation] = useValidation(validators);
  const props = useField({
    type: "text",
    name,
    index,
    touched,
    value: initValue,
    ...validation
  });

  const showError = status.error !== undefined;

  return (
    <TextFieldMUI
      fullWidth
      className={className}
      autoFocus={autoFocus}
      inputRef={inputRef}
      label={label}
      variant={variant}
      helperText={helperText}
      error={showError}
      inputProps={inputProps}
      {...props}
    />
  );
}
