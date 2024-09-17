import {IMessage} from "@stomp/stompjs";
import {CandidateMessage, DescriptionMessage, requestAnswer, requestCandidate, requestOffer} from "@/client/signaling.ts";
import {createStompClient} from "@/lib/web/stomp.ts";
import {RtcConnection, useDccMapStore} from "@/hooks/test/useConnectionStore.ts";
import {useStreamStompStore} from "@/hooks/test/StreamStompStore.ts";

interface Account {
  id: number;
}

interface ChatUser {
  account: Account;
}

export function useChatMessagesRTC(
  chatRoomId: number,
  myInfo: Account,
  chatUsers: ChatUser[],
) {

  const {connMap, addConn, restore, prevCandidateMap, addPrevCandidate} = useDccMapStore();
  const {setNewStompClient} = useStreamStompStore();

  const createConn = (targetId: number) => {
    const pc = new RTCPeerConnection({
      iceServers: [ { urls: "stun:stun.l.google.com:19302" } ],
    });
    pc.onicecandidate = async ev => {
      if (ev.candidate === undefined || ev.candidate === null) return;

      console.log(`send candidate: ${ev.candidate.candidate}`);
      await requestCandidate(chatRoomId, {
        candidate: ev.candidate,
        senderId: myInfo.id,
        receiverId: targetId,
      });
    }

    pc.ontrack = async ev => {
      console.log("ontrack")
      const stream = ev.streams[0];
      const video = document.createElement("video");
      video.srcObject = stream;
      video.autoplay = true;
      document.body.appendChild(video);
    }
    const dcc = new RtcConnection(pc, targetId);
    addConn(dcc);
    return dcc;
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

    let dcc = connMap.get(senderId);
    if (dcc === undefined) {
      dcc = createConn(senderId);
    }
    const con = dcc!.connection;

    await con.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await con.createAnswer();
    await con.setLocalDescription(new RTCSessionDescription(answer));
    await dcc.emitRemoteDesc(prevCandidateMap);

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

    const dcc = connMap.get(senderId);
    const con = dcc?.connection;
    if (con === undefined) {
      console.log("not found dcc in answer");
      return;
    }
    await con.setRemoteDescription(new RTCSessionDescription(answer));
    await dcc?.emitRemoteDesc(prevCandidateMap);
    console.log(`answer: ${msg.body}`);
  }

  const subCandidate = async (msg: IMessage) => {
    const {candidate, senderId, receiverId} = JSON.parse(msg.body) as CandidateMessage;
    if (myInfo.id !== receiverId) {
      return;
    }

    const dcc = connMap.get(senderId);
    const con = dcc?.connection;
    if (con === undefined) {
      console.log("not found dcc in candidate");
      return;
    }

    if (con.remoteDescription === null) {
      addPrevCandidate(senderId, new RTCIceCandidate(candidate));
    } else {
      await con.addIceCandidate(new RTCIceCandidate(candidate));
    }
    console.log(`received candidate: ${candidate.candidate}`);
  }

  const connect = () => {
    console.log("start connect")
    const stomp = createStompClient();
    stomp.onConnect  = async () => {
      const offerSub = stomp.subscribe(`/sub/signal/offer/${chatRoomId}`, subOffer);
      const answerSub = stomp.subscribe(`/sub/signal/answer/${chatRoomId}`, subAnswer);
      const candidateSub = stomp.subscribe(`/sub/signal/candidate/${chatRoomId}`, subCandidate);
      setNewStompClient(stomp, [offerSub, answerSub, candidateSub]);

      // set rtc connections
      const targets = chatUsers.map(it => it.account).filter(it => it.id !== myInfo.id)
      for (const target of targets) {
        const dcc = createConn(target.id);
        await reqOffer(dcc.connection, target);
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
