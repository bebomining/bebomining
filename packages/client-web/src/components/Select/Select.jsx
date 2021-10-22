import React, { useEffect, useRef } from "react";
import { default as ReactSelect } from "react-select";
import { useField, useValidation } from "usetheform";

export function Select({
  onChangeValue,
  name,
  options,
  validators,
  matchValue,
  reduceValue,
  autoFocus = true,
  isMulti = false,
  isOptionDisabled = () => false,
  ...props
}) {
  const [, validation] = useValidation(validators);
  const ref = useRef();

  const { value, setValue } = useField({ type: "custom", name, ...validation });
  const onChange = reactSelect => {
    let value;

    if (!isMulti) {
      value = reactSelect.value;
    } else {
      value = reactSelect;
    }

    if (typeof reduceValue === "function") {
      value = reduceValue(value);
    }

    setValue(value);
    onChangeValue?.(value);
  };

  const reactSelectValue =
    typeof matchValue === "function"
      ? matchValue(options, value)
      : !isMulti
      ? options.find(({ value: target }) => target === value)
      : value;

  useEffect(() => {
    autoFocus && setTimeout(() => ref.current && ref.current.focus(), 150);
  }, [autoFocus]);

  return (
    <ReactSelect
      maxMenuHeight={150}
      ref={ref}
      options={options}
      onChange={onChange}
      value={reactSelectValue}
      isMulti={isMulti}
      isOptionDisabled={() => isOptionDisabled(reactSelectValue)}
      {...props}
    />
  );
}
