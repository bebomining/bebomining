import { useEffect, useRef } from "react";
import Socket from "socket.io-client";

const iceServer1 = process.env.REACT_APP_ICE_SERVER_1;
const iceServer2 = process.env.REACT_APP_ICE_SERVER_1;
const iceCandidatePoolSize = process.env.REACT_APP_ICE_SERVER_POOLSIZE;

const config = {
  iceServers: [{ urls: [iceServer1, iceServer2] }],
  iceCandidatePoolSize
};
const server = process.env.REACT_APP_SERVER_SOCKET_IO;

export function useSocketAndWebRTC(opts = {}) {
  const { bus } = opts;
  const socketRef = useRef(null);
  const myConnection = useRef(null);
  const commands = useRef(null);
  const roomId = useRef(null);

  const closePeerConnection = () => {
    if (myConnection.current) {
      myConnection.current.close();
    }
  };

  const close = () => {
    if (myConnection.current) {
      myConnection.current.close();
    }
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("leave-room", { roomId: roomId.current });
      socketRef.current.close();
    }
  };

  const sendCommand = cmd => {
    const message = typeof cmd === "object" ? JSON.stringify(cmd) : cmd;
    commands.current.send(message);
  };

  //when we got an ice candidate from a remote user
  const handleCandidates = async ({ candidate }) => {
    console.log("handleCandidates");
    try {
      if (candidate) {
        myConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.log("Candidate Error", err);
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
          closePeerConnection();
          break;
      }
    };

    peerTarget.onnegotiationneeded = event => {
      console.info({ type: "onnegotiationneeded", event });
    };

    peerTarget.onicecandidate = event => {
      console.info({ type: "onicecandidate", roomId: roomId.current });
      if (event.candidate) {
        socketRef.current.emit("candidate", {
          candidate: event.candidate,
          roomId: roomId.current
        });
      } else {
        console.log("End collecting candidates");
      }
    };
  };

  const handleOffers = async ({ asker }) => {
    console.log({ type: "handleOffers", asker });

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
            bus.emit("route.event", data);
            console.log({ type: "bus.emit", data });
          }
        } catch (err) {
          console.log({ type: "bus.emit.error", err });
        }
        console.log({ type: "channel.onmessage", data: event.data });
      };

      event.channel.onopen = function (event) {
        console.log({ type: "channel.onopen", event });
      };

      event.channel.onerror = function (error) {
        console.log({ type: "channel.onerror", error });
      };
    };

    addPeerListener(myConnection.current);

    try {
      const offer = await myConnection.current.createOffer();
      await myConnection.current.setLocalDescription(offer);

      socketRef.current.emit("offer", {
        roomId: roomId.current,
        offer,
        to: asker
      });
    } catch (err) {
      console.log("Offer Error", err);
    }
  };

  const handleAnswers = async ({ answer }) => {
    console.log({ type: "handleAnswers" });
    try {
      await myConnection.current.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    } catch (err) {
      console.log("Answer Error", err);
    }
  };

  const isConnected = () => socketRef?.current?.connected;

  const connect = targetRoomId => {
    console.log({ type: "connection", roomId: targetRoomId, server });
    roomId.current = targetRoomId;
    socketRef.current = Socket.connect(server);

    socketRef.current.on("connect", () => {
      console.log({ type: "connected", roomId: targetRoomId, server });
      socketRef.current.on("offer-request", handleOffers);
      socketRef.current.on("answer", handleAnswers);
      socketRef.current.on("candidate", handleCandidates);
      socketRef.current.emit("create-room", { roomId: roomId.current });
    });

    socketRef.current.on("disconnect", () => {
      console.log({ type: "disconnect" });
    });

    socketRef.current.on("connect_error", err => {
      console.log({ type: "connect_error", err });
    });
  };

  useEffect(() => {
    return () => {
      close();
    };
  }, []);

  return { connect, close, sendCommand, isConnected };
}
