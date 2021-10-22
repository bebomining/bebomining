import React from "react";
import { default as SwitchMUI } from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import { Input, useSelector } from "usetheform";
import { useAppContext } from "./../../../hooks/useAppContext";
import { fetch } from "./../../../utils";

export function SwitchBtn({ name, label, initValue, ...restProps }) {
  const [, setSwitch] = useSelector(state => state.cloudEnabled);
  const { apiServer } = useAppContext();

  const onChange = async event => {
    try {
      const command = event.target.checked ? "_enable" : "_disable";
      await fetch(`${apiServer}/api/v1/settings/cloud/${command}`, {
        method: "PUT"
      });
      setSwitch(event.target.checked);
    } catch (err) {}
  };

  return (
    <>
      <Input type="hidden" name={name} value={initValue} />
      <FormControlLabel
        control={
          <SwitchMUI
            {...restProps}
            defaultChecked={initValue === true}
            onChange={onChange}
          />
        }
        label={label}
      />
    </>
  );
}
