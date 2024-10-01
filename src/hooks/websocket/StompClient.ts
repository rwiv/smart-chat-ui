import {Client, messageCallbackType, StompSubscription} from "@stomp/stompjs";

export class StompClient {

  constructor(
    private stomp: Client,
    private subs: StompSubscription[],
  ) {
  }

  isRestored() {
    return this.subs.length === 0;
  }

  subscribe(destination: string, cb: messageCallbackType) {
    const stompSub = this.stomp.subscribe(destination, cb);
    if (stompSub === undefined) {
      throw Error("sub is undefined");
    }
    this.subs.push(stompSub);
  }

  async close() {
    this.subs.forEach(it => it.unsubscribe());
    await this.stomp?.deactivate();
  }
}
