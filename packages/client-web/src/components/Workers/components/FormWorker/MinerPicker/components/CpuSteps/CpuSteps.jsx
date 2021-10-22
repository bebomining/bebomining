import React from "react";
import { Input } from "usetheform";
import { VersionPicker } from "./../VersionPicker/VersionPicker";

export function CpuSteps({ modeTarget }) {
  return (
    <div>
      <Input type="hidden" name="gpus" value="-1" />
      <VersionPicker modeTarget={modeTarget} />
    </div>
  );
}
