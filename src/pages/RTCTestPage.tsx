import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button.tsx";

export function RTCTestPage() {
  const [userId, setUserId] = useState<number>(-1);

  useEffect(() => {
    console.log("hello");
  }, []);

  const onClick = (id: number) => {
    setUserId(id);
  }

  const startConnect = () => {

  }

  return (
    <div>
      <div>{userId}</div>
      <div>
        <Button onClick={() => onClick(1)}>1</Button>
        <Button onClick={() => onClick(2)}>2</Button>
      </div>
      <Button onClick={startConnect}>connect</Button>
    </div>
  )
}
