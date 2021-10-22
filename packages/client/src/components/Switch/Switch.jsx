import React from "react";
import { default as SwitchMUI } from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { useField } from "usetheform";

// eslint-disable-next-line react/prop-types
export function Switch({ name, label, initValue, ...restProps }) {
  const { onChange, value } = useField({
    type: "checkbox",
    name,
    value: initValue,
    checked: initValue === true
  });
  return (
    <FormControlLabel
      control={
        <SwitchMUI
          {...restProps}
          defaultChecked={value === true}
          onChange={onChange}
          value={value}
        />
      }
      label={label}
    />
  );
}
