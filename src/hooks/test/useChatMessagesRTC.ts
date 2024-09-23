import {IMessage} from "@stomp/stompjs";
import {CandidateMessage, DescriptionMessage, requestAnswer, requestCandidate, requestOffer} from "@/client/signaling.ts";
import {createStompClient} from "@/lib/web/stomp.ts";
import {RtcConnection, useConnMapStore} from "@/hooks/test/useConnectionStore.ts";
import {useStreamStompStore} from "@/hooks/test/StreamStompStore.ts";

export interface Account {
  id: number;
}

export interface ChatUser {
  account: Account;
}

export function useChatMessagesRTC(
  chatRoomId: number,
  myInfo: Account,
  chatUsers: ChatUser[],
  localStream: MediaStream,
  remoteStream: MediaStream,
) {

  const {connMap, addConn, restore} = useConnMapStore();
  const {setNewStompClient} = useStreamStompStore();

  const createConn = (targetId: number) => {
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

  const reqOffer = async (pc: RTCPeerConnection, target: Account) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(new RTCSessionDescription(offer));

    await requestOffer(chatRoomId, {
      description: offer,
      senderId: myInfo.id,
      receiverId: target.id,
    });
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

  const connect = () => {
    const stomp = createStompClient();
    stomp.onConnect  = async () => {
      const offerSub = stomp.subscribe(`/sub/signal/offer/${chatRoomId}`, subOffer);
      const answerSub = stomp.subscribe(`/sub/signal/answer/${chatRoomId}`, subAnswer);
      const candidateSub = stomp.subscribe(`/sub/signal/candidate/${chatRoomId}`, subCandidate);
      setNewStompClient(stomp, [offerSub, answerSub, candidateSub]);

      // set rtc connections
      const targets = chatUsers.map(it => it.account).filter(it => it.id !== myInfo.id)
      for (const target of targets) {
        const conn = createConn(target.id);
        await reqOffer(conn.pc, target);
      }
    }
    stomp.activate();
  }

  const disconnect = () => {
    console.log("start disconnect")
    restore();
    setNewStompClient(undefined, []);
  }

  return {connect, disconnect};
}
