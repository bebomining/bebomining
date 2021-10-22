import { useEffect, useRef } from "react";
import Socket from "socket.io-client";
import Button from "@material-ui/core/Button";
import { useNotificationError } from "./useNotificationError";

const iceServer1 = process.env.REACT_APP_ICE_SERVER_1;
const iceServer2 = process.env.REACT_APP_ICE_SERVER_1;
const iceCandidatePoolSize = process.env.REACT_APP_ICE_SERVER_POOLSIZE;

const config = {
  iceServers: [{ urls: [iceServer1, iceServer2] }],
  iceCandidatePoolSize
};
const server = process.env.REACT_APP_SERVER_SOCKET_IO;

export function useSocketAndWebRTC({ roomId, bus }, onReady) {
  const socketRef = useRef(null);
  const myConnection = useRef(null);
  const commands = useRef(null);
  const { addError } = useNotificationError();
  const close = () => {
    if (myConnection.current) {
      myConnection.current.close();
    }
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.close();
    }
  };

  const sendCommand = cmd => {
    try {
      const message = typeof cmd === "object" ? JSON.stringify(cmd) : cmd;
      commands.current.send(message);
    } catch (err) {
      addError(
        new Error("Connection Lost!"),
        <Button onClick={() => location.reload()} color="inherit" size="small">
          REFRESH
        </Button>
      );
    }
  };

  //when we got an ice candidate from a remote user
  const handleCandidates = async ({ candidate }) => {
    try {
      if (candidate) {
        myConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.err("Candidate Error", err);
    }
  };

  const addPeerListener = peerTarget => {
    peerTarget.oniceconnectionstatechange = e => {
      const { iceConnectionState } = e?.target;
      console.info({ type: "oniceconnectionstatechange", iceConnectionState });
      switch (iceConnectionState) {
        case "disconnected":
        case "failed":
        case "closed":
          close();
          break;
      }
    };

    peerTarget.onnegotiationneeded = event => {
      console.info({ type: "onnegotiationneeded", event });
    };

    peerTarget.onicecandidate = event => {
      console.info({ type: "onicecandidate", roomId });
      if (event.candidate) {
        socketRef.current.emit("candidate", {
          candidate: event.candidate,
          roomId
        });
      } else {
        console.log("End collecting candidates");
      }
    };
  };

  const createAnswer = async ({ sender, offer }) => {
    myConnection.current = new RTCPeerConnection(config, {});

    const dataChannelOptions = { reliable: true };

    commands.current = myConnection.current.createDataChannel(
      "commands",
      dataChannelOptions
    );

    myConnection.current.ondatachannel = function (event) {
      event.channel.onmessage = function (event) {
        try {
          const data = JSON.parse(event.data);
          if (typeof data.namespace === "string") {
            const { namespace, api, id } = data;
            bus.emit(`${namespace}-${id}`, api);
            console.log({ type: "bus.emit", namespace, api, id });
          }
        } catch (err) {
          console.err({ type: "bus.emit.error", err });
        }
        console.log({ type: "channel.onmessage", data: event.data });
      };

      event.channel.onopen = function (event) {
        window._SOCKET = { send: sendCommand };
        onReady(sendCommand);
        console.log({ type: "channel.onopen", event });
      };

      event.channel.onerror = function (error) {
        console.log({ type: "channel.onerror", error });
      };
    };

    addPeerListener(myConnection.current);

    try {
      await myConnection.current.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await myConnection.current.createAnswer();
      await myConnection.current.setLocalDescription(answer);

      socketRef.current.emit("answer", {
        roomId,
        answer,
        to: sender
      });
    } catch (err) {
      console.log("answer Error", err);
    }
  };

  const connect = () => {
    console.log({ type: "connection", server });
    socketRef.current = Socket.connect(server);

    socketRef.current.on("connect", () => {
      console.log({ type: "connected", server });
      socketRef.current.on("offer-received", createAnswer);
      socketRef.current.on("candidate", handleCandidates);
      socketRef.current.on("join-room-error", () => {
        console.log({ type: "join-room-error", roomId });
        close();
      });

      socketRef.current.emit("join-room", { roomId });
    });

    socketRef.current.on("disconnect", () => {
      console.log({ type: "disconnect" });
    });

    socketRef.current.on("connect_error", () => {
      console.log({ type: "connect_error" });
    });
  };

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  useEffect(() => {
    if (roomId && roomId.trim() !== "") {
      connect();
    }
  }, [roomId]);
}
