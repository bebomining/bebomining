import { useEffect } from "react";

import {
  ON_PLAY_WORKER_START,
  ON_PLAY_WORKER_END_SUCCESS,
  ON_PLAY_WORKER_END_ERROR,
  ON_STOP_WORKER_START,
  ON_STOP_WORKER_END_SUCCESS,
  ON_STOP_WORKER_END_ERROR,
  ON_REMOVE_WORKER_START,
  ON_REMOVE_WORKER_END_SUCCESS,
  ON_REMOVE_WORKER_END_ERROR
} from "./../Workers/events";

import {
  ON_CREATE_WALLET_SUCCESS,
  ON_CREATE_WALLET_API_ERROR
} from "./../Wallets/events";

export function GAevents({ bus }) {
  useEffect(() => {
    bus.on(ON_CREATE_WALLET_SUCCESS, onCreateWalletSuccess);
    bus.on(ON_CREATE_WALLET_API_ERROR, onCreateWalletApiError);

    bus.on(ON_PLAY_WORKER_START, onPlayWorkerStart);
    bus.on(ON_STOP_WORKER_START, onStopWorkerStart);

    bus.on(ON_PLAY_WORKER_END_SUCCESS, onPlayWorkerEndSuccess);
    bus.on(ON_PLAY_WORKER_END_ERROR, onPlayWorkerEndError);

    bus.on(ON_STOP_WORKER_END_SUCCESS, onStopWorkerEndSuccess);
    bus.on(ON_STOP_WORKER_END_ERROR, onStopWorkerEndError);

    bus.on(ON_REMOVE_WORKER_START, onRemoveWorkerStart);
    bus.on(ON_REMOVE_WORKER_END_SUCCESS, onRemoveWorkerEndSuccess);
    bus.on(ON_REMOVE_WORKER_END_ERROR, onRemoveWorkerEndError);

    return () => {
      bus.off(ON_CREATE_WALLET_SUCCESS, onCreateWalletSuccess);
      bus.off(ON_CREATE_WALLET_API_ERROR, onCreateWalletApiError);

      bus.off(ON_PLAY_WORKER_START, onPlayWorkerStart);
      bus.off(ON_STOP_WORKER_START, onStopWorkerStart);

      bus.off(ON_PLAY_WORKER_END_SUCCESS, onPlayWorkerEndSuccess);
      bus.off(ON_PLAY_WORKER_END_ERROR, onPlayWorkerEndError);

      bus.off(ON_STOP_WORKER_END_SUCCESS, onStopWorkerEndSuccess);
      bus.off(ON_STOP_WORKER_END_ERROR, onStopWorkerEndError);

      bus.off(ON_REMOVE_WORKER_START, onRemoveWorkerStart);
      bus.off(ON_REMOVE_WORKER_END_SUCCESS, onRemoveWorkerEndSuccess);
      bus.off(ON_REMOVE_WORKER_END_ERROR, onRemoveWorkerEndError);
    };
  }, []);

  return null;
}

/* ---- WALLET_ACTIONS ---- */
const WALLET_ACTIONS = "wallet_actions";

function onCreateWalletSuccess(wallet) {
  const { walletName } = wallet;
  const eventProps = {
    eventName: ON_CREATE_WALLET_SUCCESS,
    eventCategory: WALLET_ACTIONS,
    eventLabel: `${walletName}`
  };
  trigger(eventProps);
}

function onCreateWalletApiError(wallet) {
  const { walletName } = wallet;
  const eventProps = {
    eventName: ON_CREATE_WALLET_API_ERROR,
    eventCategory: WALLET_ACTIONS,
    eventLabel: `${walletName}`
  };
  trigger(eventProps);
}
/* ---- WALLET_ACTIONS ---- */

/* --- CARD_WORKER_ACTIONS --- */
const CARD_WORKER_ACTIONS = "card_worker_actions";

function onPlayWorkerStart(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_PLAY_WORKER_START,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onStopWorkerStart(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_STOP_WORKER_START,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onPlayWorkerEndSuccess(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_PLAY_WORKER_END_SUCCESS,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onPlayWorkerEndError(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_PLAY_WORKER_END_ERROR,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onStopWorkerEndError(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_STOP_WORKER_END_ERROR,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onStopWorkerEndSuccess(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_STOP_WORKER_END_SUCCESS,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onRemoveWorkerStart(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_REMOVE_WORKER_START,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onRemoveWorkerEndSuccess(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_REMOVE_WORKER_END_SUCCESS,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

function onRemoveWorkerEndError(worker) {
  const { workerName, coinName, minerMode, minerName, poolName, algo } = worker;
  const eventProps = {
    eventName: ON_REMOVE_WORKER_END_ERROR,
    eventCategory: CARD_WORKER_ACTIONS,
    eventLabel: `${workerName}|${coinName}|${poolName}|${minerName}|${algo}|${minerMode}`
  };
  trigger(eventProps);
}

/* --- CARD_WORKER_ACTIONS --- */

function trigger({ eventName, eventCategory, eventLabel }) {
  gtag("event", eventName, {
    event_category: eventCategory,
    event_label: eventLabel
  });
}
