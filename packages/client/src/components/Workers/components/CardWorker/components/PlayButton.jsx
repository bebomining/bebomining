import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import StartWorkerIcon from "@material-ui/icons/PlayCircleOutline";
import StopWorkerIcon from "@material-ui/icons/StopTwoTone";
import Button from "@material-ui/core/Button";

export const STATUS = { run: true, stop: false };
const labels = { true: "Run", false: "Stop" };

export function PlayButton({
  innerRef,
  onPlay,
  onStop,
  className,
  forceDisabled,
  initialStatus = STATUS.run
}) {
  const [action, setAction] = useState(() => initialStatus);
  const prevAction = useRef(action);

  const [type, setType] = useState(() => labels[action]);

  const [isDisabled, disabled] = useState(() => false);

  const toggleButton = () => setAction(prev => !prev);

  useImperativeHandle(innerRef, () => ({
    forceShowPlayBtn() {
      disabled(true);
      prevAction.current = STATUS.run;
      setAction(STATUS.run);
      setTimeout(() => {
        setType(labels[STATUS.run]);
        disabled(false);
      }, 100);
    }
  }));

  useEffect(() => {
    if (prevAction.current === STATUS.run && action === STATUS.stop) {
      disabled(true);
      onPlay?.()
        .then(() => {
          setType(labels[STATUS.stop]);
          prevAction.current = action;
        })
        .catch(() => setAction(STATUS.run))
        .finally(() => disabled(false));
    } else if (prevAction.current === STATUS.stop && action === STATUS.run) {
      disabled(true);
      onStop?.()
        .then(() => {
          setType(labels[STATUS.run]);
          prevAction.current = action;
        })
        .catch(() => setAction(STATUS.stop))
        .finally(() => disabled(false));
    }
  }, [action]);

  const isRun = type === labels[STATUS.run];
  const label = isRun ? labels[STATUS.run] : labels[STATUS.stop];
  const color = isRun ? "default" : "secondary";

  return (
    <Button
      className={className}
      size="small"
      disabled={isDisabled || forceDisabled}
      color={color}
      aria-label={type}
      title={type}
      startIcon={isRun ? <StartWorkerIcon /> : <StopWorkerIcon />}
      onClick={toggleButton}
    >
      {label}
    </Button>
  );
}
