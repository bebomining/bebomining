import React from "react";
import { useSelector, Collection, PersistStateOnUnmount } from "usetheform";
import { GpuSteps } from "./components/GpuSteps/GpuSteps";
import { CpuSteps } from "./components/CpuSteps/CpuSteps";

export function MinerPicker() {
  const [minerMode] = useSelector(state => state.minerMode);
  return (
    <div>
      <Collection object name="miner" validators={[isValid]}>
        <PersistStateOnUnmount>
          {minerMode === "gpu" && <GpuSteps key="gpu" modeTarget={minerMode} />}
          {minerMode === "cpu" && <CpuSteps key="cpu" modeTarget={minerMode} />}
        </PersistStateOnUnmount>
      </Collection>
    </div>
  );
}

function isValid(miner = {}) {
  return Object.keys(miner).every(key => typeof miner[key] !== "undefined")
    ? undefined
    : "error";
}
