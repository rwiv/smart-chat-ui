import {MouseEvent, ReactNode, useEffect, useRef, useState} from "react";
import {useStompStore} from "@/hooks/websocket/useStompStore.ts";
import {IMessage} from "@stomp/stompjs";
import {SketchTools} from "@/components/canvas/SketchTools.tsx";

interface SketchCanvasPros {
  children: ReactNode;
  chatRoomId: string;
  isRemote: boolean;
  width: string;
  height: string;
}

type MessageType = "move" | "draw" | "size" | "color" | "clear";

interface CanvasMessage {
  type: MessageType;
  x: number;
  y: number;
  size: number;
  color: string;
}

export function SketchCanvas({ children, chatRoomId, isRemote, width, height }: SketchCanvasPros) {

  const {stompClient, isConnected} = useStompStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [lineWidth, setLineWidthState] = useState([1])

  useEffect(() => {
    return () => {
      if (stompClient) {
        stompClient.unsubscribe(`/sub/chat-rooms/${chatRoomId}/canvas`);
      }
    }
  }, []);

  useEffect(() => {
    if (stompClient && isConnected) {
      stompClient.subscribe(`/sub/chat-rooms/${chatRoomId}/canvas`, onSendMessage);
    }
  }, [stompClient, isConnected]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, [canvasRef]);

  const onSendMessage = (msg: IMessage) => {
    if (!isRemote) return;
    const {type, x, y, size, color} = JSON.parse(msg.body) as CanvasMessage;
    const ctx = canvasRef.current?.getContext("2d");
    switch (type) {
      case "move":
        move(x, y);
        break;
      case "draw":
        draw(x, y);
        break;
      case "size":
        if (ctx) {
          ctx.lineWidth = size;
        }
        break;
      case "color":
        if (ctx) {
          ctx.strokeStyle = color;
        }
        break;
      case "clear":
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
        break;
    }
  }

  const send = (type: MessageType, x: number, y: number, size: number, color: string) => {
    const msg: CanvasMessage = { type, x, y, size, color };
    stompClient?.send(`/pub/chat-rooms/${chatRoomId}/canvas`, msg);
  }

  const setLineWidth = (newLineWidth: number[]) => {
    setLineWidthState(newLineWidth);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = newLineWidth[0];
    send("size", -1, -1, newLineWidth[0], "");
  }

  const setStrokeStyle = (newStrokeStyle: string) => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = newStrokeStyle;
    send("color", -1, -1, -1, newStrokeStyle);
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    send("clear", -1, -1, -1, "");
  }

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    if (isRemote) return;

    if (!drawing) {
      move(x, y);
      send("move", x, y, -1, "");
    } else {
      draw(x, y);
      send("draw", x, y, -1, "");
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
      {!isRemote && (
        <SketchTools
          lineWidth={lineWidth}
          setLineWidth={setLineWidth}
          setStrokeStyle={setStrokeStyle}
          clearCanvas={clearCanvas}
        />
      )}
    </div>
  )
}
