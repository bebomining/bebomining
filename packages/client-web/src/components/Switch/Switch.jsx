import React from "react";
import { default as SwitchMUI } from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { useField } from "usetheform";

// eslint-disable-next-line react/prop-types
export function Switch({ name, label, ...restProps }) {
  const { onChange, value } = useField({ type: "checkbox", name });
  return (
    <FormControlLabel
      control={<SwitchMUI {...restProps} onChange={onChange} value={value} />}
      label={label}
    />
  );
}
