import {IMessage} from "@stomp/stompjs";
import {
  CandidateMessage,
  DescriptionMessage,
  requestAnswer,
  requestCandidate,
  requestOffer
} from "@/client/signaling.ts";
import {Account, ChatUser} from "@/graphql/types.ts";
import {useConnMapStore} from "@/hooks/webrtc/useConnMapStore.ts";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {useState} from "react";
import {useMediaStreamStore} from "@/hooks/webrtc/useMediaStreamStore.ts";
import {RtcConnection} from "@/hooks/webrtc/RtcConnection.ts";

export function useRtcConnections(
  chatRoomId: string,
  myInfo: Account,
  chatUsers: ChatUser[],
) {

  const [isConnected, setIsConnected] = useState(false);
  const {connMap, addConn, restore} = useConnMapStore();
  const {stompClient} = useStompStore();
  const {localStream} = useMediaStreamStore();

  const createConn = (targetId: string) => {
    const remoteStream = new MediaStream();
    const pc = new RTCPeerConnection({
      iceServers: [ { urls: "stun:stun.l.google.com:19302" } ],
    });

    pc.onicecandidate = async ev => {
      console.log("onicecandidate");
      if (ev.candidate === undefined || ev.candidate === null) return;

      console.log(`send candidate: ${ev.candidate.candidate}`);
      await requestCandidate(chatRoomId, {
        candidate: ev.candidate,
        senderId: myInfo.id,
        receiverId: targetId,
      });
    }

    // receive remote stream
    pc.ontrack = async ev => {
      console.log("ontrack")
      remoteStream.addTrack(ev.track);
    }

    if (localStream === undefined) {
      throw Error("localStream is undefined");
    }

    // send local stream
    const videoTracks = localStream.getVideoTracks();
    const audioTracks = localStream.getAudioTracks();
    if (videoTracks.length !== 1 || audioTracks.length !== 1) {
      throw Error("invalid stream");
    }

    const audioSender = pc.addTrack(audioTracks[0], localStream);
    const videoSender = pc.addTrack(videoTracks[0], localStream);

    const conn = new RtcConnection(pc, targetId, audioSender, videoSender, remoteStream);
    addConn(conn);
    return conn;
  }

  const subOffer = async (msg: IMessage) => {
    const {description: offer, senderId, receiverId} = JSON.parse(msg.body) as DescriptionMessage;
    if (myInfo.id !== receiverId) {
      return;
    }

    let conn = connMap.get(senderId);
    if (conn === undefined) {
      conn = createConn(senderId);
    }
    const pc = conn!.pc;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(new RTCSessionDescription(answer));

    await requestAnswer(chatRoomId, {
      description: answer,
      senderId: myInfo.id,
      receiverId: senderId,
    });

    console.log(`offer: ${msg.body}`);
  }

  const subAnswer = async (msg: IMessage) => {
    const {description: answer, senderId, receiverId} = JSON.parse(msg.body) as DescriptionMessage;
    if (myInfo?.id !== receiverId) {
      return;
    }

    const conn = connMap.get(senderId);
    const pc = conn?.pc;
    if (pc === undefined) {
      console.log("not found dcc in answer");
      return;
    }
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log(`answer: ${msg.body}`);
  }

  const subCandidate = async (msg: IMessage) => {
    console.log("subCandidate");
    const {candidate, senderId, receiverId} = JSON.parse(msg.body) as CandidateMessage;
    if (myInfo.id !== receiverId) {
      return;
    }

    const conn = connMap.get(senderId);
    if (conn === undefined) {
      console.log("not found conn");
      return;
    }
    const pc = conn.pc;
    if (pc === undefined) {
      throw Error("pc is undefined");
    }

    await pc.addIceCandidate(new RTCIceCandidate(candidate));
    console.log(`received candidate: ${candidate.candidate}`);
  }

  const connect = async () => {
    console.log("start connect");

    // create RtcConnections
    const targets = chatUsers
      .map(it => it.account)
      .filter(it => it.id !== myInfo.id);

    const conns: RtcConnection[] = [];
    for (const target of targets) {
      const conn = createConn(target.id);
      conns.push(conn);
    }

    // create stomp client
    const stomp = await stompClient.init();
    stompClient.activate();

    stomp.onConnect = async () => {
      setIsConnected(true);

      // subscribe
      stompClient.subscribe(`/sub/signal/offer/${chatRoomId}`, subOffer);
      stompClient.subscribe(`/sub/signal/answer/${chatRoomId}`, subAnswer);
      stompClient.subscribe(`/sub/signal/candidate/${chatRoomId}`, subCandidate);

      // request offer
      for (const conn of conns) {
        const pc = conn.pc;
        const offer = await pc.createOffer();
        await pc.setLocalDescription(new RTCSessionDescription(offer));

        await requestOffer(chatRoomId, {
          description: offer,
          senderId: myInfo.id,
          receiverId: conn.targetId,
        });
      }
    }
  }

  const disconnect = async () => {
    console.log("start disconnect")
    restore();
    await stompClient.close();
  }

  return {connect, disconnect, isConnected};
}
