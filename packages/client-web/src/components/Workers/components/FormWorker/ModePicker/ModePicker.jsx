import React from "react";
import { Link } from "react-router-dom";
import { useField, Input } from "usetheform";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import Typography from "@material-ui/core/Typography";

import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { useFetch } from "./../../../../../hooks/useFetch";

export function ModePicker() {
  const classes = useStyles();

  const { value, setValue } = useField({
    name: "minerMode",
    type: "custom",
    validators: [required]
  });

  const { loading, data } = useFetch(`miners/_installed`);

  if (loading || loading === null) {
    return (
      <div className={classes.loadingBar}>
        <CircularProgress />
      </div>
    );
  }

  const results = data?.results || [];
  const minersMode = results
    .map(({ minerMode }) => minerMode)
    .map(val => val.toLowerCase());

  if (!minersMode.includes("gpu")) {
    return (
      <div className={classes.ModePickerWrapper}>
        <RadioGroup row aria-label="minerMode" name="minerMode" value="cpu">
          <FormControlLabel
            value="cpu"
            control={<Radio inputProps={{ "aria-label": "CPU" }} />}
            label="CPU mode"
          />
        </RadioGroup>
        <Typography className={classes.textSecondary} color="textSecondary">
          You have installed miners which support CPU only.
        </Typography>
        <Typography color="textSecondary">
          If you want to mine using GPU please install a miner that supports
          GPU. <Link to="/miners">Click here</Link>
        </Typography>
        <Input type="hidden" name="minerMode" value="cpu" />
      </div>
    );
  }

  if (!minersMode.includes("cpu")) {
    return (
      <div className={classes.ModePickerWrapper}>
        <RadioGroup row aria-label="minerMode" name="minerMode" value="gpu">
          <FormControlLabel
            value="gpu"
            control={<Radio inputProps={{ "aria-label": "GPU" }} />}
            label="GPU mode"
          />
        </RadioGroup>
        <Typography className={classes.textSecondary} color="textSecondary">
          You have installed miners which support GPU only.
        </Typography>
        <Typography color="textSecondary">
          If you want to mine using CPU please install a miner that supports
          CPU. <Link to="/miners">Click here</Link>
        </Typography>
        <Input type="hidden" name="minerMode" value="gpu" />
      </div>
    );
  }

  const handleChange = event => setValue(event.target.value);

  return (
    <div className={classes.ModePickerWrapper}>
      <RadioGroup
        row
        aria-label="minerMode"
        name="minerMode"
        value={value || null}
        onChange={handleChange}
      >
        <FormControlLabel
          value="gpu"
          control={
            <Radio
              name="miner-picker-mode"
              inputProps={{ "aria-label": "GPU" }}
            />
          }
          label="GPU mode"
        />

        <FormControlLabel
          value="cpu"
          control={
            <Radio
              name="miner-picker-mode"
              inputProps={{ "aria-label": "CPU" }}
            />
          }
          label="CPU mode"
        />
      </RadioGroup>
    </div>
  );
}

const required = value => (typeof value === "string" ? undefined : "required");

const useStyles = makeStyles({
  ModePickerWrapper: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
  },
  loadingBar: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  textSecondary: {
    marginTop: "24px"
  }
});
