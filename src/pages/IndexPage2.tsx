import {useEffect, useState} from "react";

interface ChatRoom {
  id: string;
  title: string;
}

export function IndexPage2() {
  const [data, setData] = useState<ChatRoom[]>([]);

  useEffect(() => {
    req();
  }, []);

  const req = async () => {
    const res = await fetch("http://localhost:8080/chat-rooms");
    const json = await res.json();
    console.log(json);
    setData(json);
  }

  return (
    <div>
      {data.map((chatRoom) => (
        <div key={chatRoom.id}>{chatRoom.title}</div>
      ))}
    </div>
  )
}
