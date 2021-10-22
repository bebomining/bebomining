import { useEffect } from "react";
import { useField } from "usetheform";

export function ActiveStepField({ activeStep }) {
  const { value, setValue } = useField({
    type: "custom",
    name: "activeStep",
    value: activeStep
  });

  useEffect(() => {
    if (activeStep !== value) {
      setValue(activeStep);
    }
  }, [activeStep, value]);

  return null;
}
