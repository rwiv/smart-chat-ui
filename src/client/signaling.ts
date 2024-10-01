import {post} from "@/lib/web/http.ts";
import {consts} from "@/configures/consts.ts";

export interface DescriptionMessage {
  description: RTCSessionDescriptionInit;
  senderId: string;
  receiverId: string;
}

export interface CandidateMessage {
  candidate: RTCIceCandidate;
  senderId: string;
  receiverId: string;
}

export function requestOffer(chatRoomId: string, body: DescriptionMessage) {
  return post(`${consts.endpoint}/api/signal/offer/${chatRoomId}`, body);
}

export function requestAnswer(chatRoomId: string, body: DescriptionMessage) {
  return post(`${consts.endpoint}/api/signal/answer/${chatRoomId}`, body);
}

export function requestCandidate(chatRoomId: string, body: CandidateMessage) {
  return post(`${consts.endpoint}/api/signal/candidate/${chatRoomId}`, body);
}
