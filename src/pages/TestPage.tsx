import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {useEffect} from "react";
import {Mutation} from "@/graphql/types.ts";
import {createChatMessageQL} from "@/client/chatMessage.ts";
import {useApolloClient} from "@apollo/client";
import {useSearchedChatRooms} from "@/hooks/chatroom/useSearchedChatRooms.ts";
import {Button} from "@/components/ui/button.tsx";
import {login, LoginRequest, myInfoQL} from "@/client/account.ts";
import {useMyInfo} from "@/hooks/common/useMyInfo.ts";
import {IMessage} from "@stomp/stompjs";

export function TestPage() {

  const apolloClient = useApolloClient();
  const {stompClient, isConnected, closeStompClient, initStompClient} = useStompStore();
  const {chatRooms} = useSearchedChatRooms();
  const {myInfo} = useMyInfo();

  useEffect(() => {
    onLoginUser1();
    return () => {
      closeStompClient();
    }
  }, []);

  useEffect(() => {
    if (myInfo) {
      initStompClient();
    }
  }, [myInfo]);

  useEffect(() => {
    if (stompClient && isConnected && stompClient.isRestored()) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRooms[0].id}/messages`, onMessage);
    }
  }, [stompClient, isConnected]);

  async function onMessage(msg: IMessage) {
    const body = JSON.parse(msg.body);
    console.log("ws");
    console.log(body);
  }

  const onLoginUser1 = async () => {
    const req: LoginRequest = {
      username: "user1@gmail.com",
      password: "1234",
    };
    await login(req, false);
    await apolloClient.refetchQueries({ include: [myInfoQL] });
  }

  const send = async (message: string) => {
    const res = await apolloClient.query<Mutation>({
      query: createChatMessageQL,
      variables: {
        req: {
          content: message,
          chatRoomId: chatRooms[0].id,
        },
      },
      fetchPolicy: "no-cache",
    });
    const chatMessage = res.data.createChatMessage;
    console.log(chatMessage);
  }

  return (
    <div>
      hello
      {chatRooms.map(chatRoom => (
        <div key={chatRoom.id}>{chatRoom.title}</div>
      ))}
      <Button onClick={() => send("hello")}>send</Button>
    </div>
  )
}
