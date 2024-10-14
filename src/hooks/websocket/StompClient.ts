import {Client, messageCallbackType, StompSubscription} from "@stomp/stompjs";

export class StompClient {

  constructor(
    private stomp: Client,
    private subs: Map<string, StompSubscription>,
  ) {
  }

  isRestored() {
    Array.from(this.subs.values())
    return Array.from(this.subs.values()).length === 0;
  }

  send(destination: string, bodyObj: any) {
    const body = JSON.stringify(bodyObj);
    this.stomp.publish({ destination, body });
  }

  subscribe(destination: string, cb: messageCallbackType) {
    const stompSub = this.stomp.subscribe(destination, cb);
    if (stompSub === undefined) {
      throw Error("sub is undefined");
    }
    this.subs.set(destination, stompSub);
  }

  unsubscribe(destination: string) {
    const sub = this.subs.get(destination);
    if (sub === undefined) {
      throw Error("sub is undefined");
    }
    sub.unsubscribe();
    this.subs.delete(destination);
  }

  async close() {
    for (const sub of this.subs.values()) {
      sub.unsubscribe();
    }
    await this.stomp?.deactivate();
  }
}
