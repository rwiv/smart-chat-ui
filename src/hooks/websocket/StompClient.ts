import {Client, messageCallbackType, StompSubscription} from "@stomp/stompjs";
import {createStompClient} from "@/lib/web/stomp.ts";

export class StompClient {

  constructor(
    public stomp: Client | undefined,
    private subs: StompSubscription[],
  ) {
  }

  subscribe(destination: string, cb: messageCallbackType) {
    const stompSub = this.stomp?.subscribe(destination, cb);
    if (stompSub === undefined) {
      throw Error("sub is undefined");
    }
    this.subs.push(stompSub);
  }

  activate() {
    return this.stomp?.activate();
  }

  async init() {
    await this.close();
    const stomp = createStompClient();
    this.stomp = stomp;
    return stomp;
  }

  async close() {
    this.subs.forEach(it => it.unsubscribe());
    await this.stomp?.deactivate();

    this.stomp = undefined;
    this.subs = [];
  }
}
