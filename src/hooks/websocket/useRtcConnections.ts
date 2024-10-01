import {IMessage} from "@stomp/stompjs";
import {
  CandidateMessage,
  DescriptionMessage,
  requestAnswer,
  requestCandidate,
  requestOffer
} from "@/client/signaling.ts";
import {Account, ChatUser, Query} from "@/graphql/types.ts";
import {useConnMapStore} from "@/hooks/webrtc/useConnMapStore.ts";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {useEffect} from "react";
import {useMediaStreamStore} from "@/hooks/webrtc/useMediaStreamStore.ts";
import {RtcConnection} from "@/hooks/webrtc/RtcConnection.ts";
import {useApolloClient} from "@apollo/client";
import {chatUserByIdQL} from "@/client/chatUser.ts";
import {StompClient} from "@/hooks/websocket/StompClient.ts";

function findChatUserMe(myInfo: Account, chatUsers: ChatUser[]): ChatUser {
  const chatUser = chatUsers.find(it => it.account.id === myInfo.id);
  if (!chatUser) {
    throw Error("chatUser is not found");
  }
  return chatUser;
}


export function useRtcConnections(
  chatRoomId: string,
  myInfo: Account,
  chatUsers: ChatUser[],
) {

  const {connMap, addConn, restoreConnMap} = useConnMapStore();
  const apolloClient = useApolloClient();
  const {stompClient, isConnected, closeStompClient, initStompClient} = useStompStore();
  const {localStream} = useMediaStreamStore();
  const myChatUser = findChatUserMe(myInfo, chatUsers);

  useEffect(() => {
    if (stompClient && isConnected && stompClient.isRestored()) {
      initRtc(stompClient);
    }
  }, [stompClient, isConnected]);

  const createConn = async (targetId: string) => {
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
        senderId: myChatUser.id,
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

    const res = await apolloClient.query<Query>({
      query: chatUserByIdQL, variables: { id: targetId }, fetchPolicy: "no-cache",
    });

    const target = res.data.chatUser;
    if (!target) {
      throw new Error("chatUser is not found");
    }

    const conn = new RtcConnection(pc, target, audioSender, videoSender, remoteStream);
    addConn(conn);
    return conn;
  }

  const subOffer = async (msg: IMessage) => {
    const {description: offer, senderId, receiverId} = JSON.parse(msg.body) as DescriptionMessage;
    if (myChatUser.id !== receiverId) {
      return;
    }

    let conn = connMap.get(senderId);
    if (conn === undefined) {
      conn = await createConn(senderId);
    }
    const pc = conn!.pc;

    await pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(new RTCSessionDescription(answer));

    await requestAnswer(chatRoomId, {
      description: answer,
      senderId: myChatUser.id,
      receiverId: senderId,
    });

    console.log(`offer: ${msg.body}`);
  }

  const subAnswer = async (msg: IMessage) => {
    const {description: answer, senderId, receiverId} = JSON.parse(msg.body) as DescriptionMessage;
    if (myChatUser?.id !== receiverId) {
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
    if (myChatUser.id !== receiverId) {
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

  const initRtc = async (stompClient: StompClient) => {
    // create RtcConnections
    const targets = chatUsers
      .filter(it => it.id !== myChatUser.id);

    const conns: RtcConnection[] = [];
    for (const target of targets) {
      const conn = await createConn(target.id);
      conns.push(conn);
    }

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
        senderId: myChatUser.id,
        receiverId: conn.target.id,
      });
    }
  }

  const connect = async () => {
    console.log("start connect");
    initStompClient();
  }

  const disconnect = () => {
    console.log("start disconnect");
    restoreConnMap();
    closeStompClient();
  }

  return {connect, disconnect};
}
