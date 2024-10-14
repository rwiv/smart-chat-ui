import {MouseEvent, ReactNode, useEffect, useRef, useState} from "react";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {IMessage} from "@stomp/stompjs";

interface SketchCanvasPros {
  children: ReactNode;
  chatRoomId: string;
  isRemote: boolean;
  width: string;
  height: string;
}

interface CanvasMessage {
  x: number;
  y: number;
  size: number;
  color: string;
}

export function SketchCanvas({ children, chatRoomId, isRemote, width, height }: SketchCanvasPros) {

  const {stompClient, isConnected} = useStompStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.unsubscribe(`/sub/chat-rooms/${chatRoomId}/canvas`);
      }
    }
  }, []);

  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRoomId}/canvas`, onMessage);
    }
  }, [stompClient, isConnected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, [canvasRef]);

  const onMessage = (msg: IMessage) => {
    if (!isRemote) return;
    const body = JSON.parse(msg.body) as CanvasMessage;
    draw(body.x, body.y);
  }

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (isRemote) return;

    if (!drawing) {
      move(x, y);
    } else {
      draw(x, y);
      const msg: CanvasMessage = { x, y, size: 1, color: "black" };
      stompClient?.send(`/pub/chat-rooms/${chatRoomId}/canvas`, msg);
    }

    // console.log(`x: ${x}, y: ${y}`);
  }

  const draw = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(x, y);
    ctx.stroke();
  }

  const move = (x: number, y: number) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  return (
    <div>
      {drawing ? (
        <div>drawing o</div>
      ) : (
        <div>drawing x</div>
      )}

      <div className="relative">
        {children}
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 z-20" css={{ width, height }}
          onMouseDown={() => setDrawing(true)}
          onMouseUp={() => setDrawing(false)}
          onMouseMove={onMouseMove}
        />
      </div>
    </div>
  )
}
