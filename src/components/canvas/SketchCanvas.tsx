import {css} from "@emotion/react";
import {MouseEvent, useEffect, useRef, useState} from "react";

export function SketchCanvas() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  }, [canvasRef]);

  const onMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const ctx = canvas.getContext("2d");
    if (!drawing) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    // console.log(`x: ${x}, y: ${y}`);
  }

  return (
    <div>
      <div>hello</div>
      {drawing ? (
        <div>drawing o</div>
      ) : (
        <div>drawing x</div>
      )}

      <div css={css`
        position: relative
      `}>
        <img
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-images/grapefruit-slice-332-332.jpg"
          alt="Grapefruit slice atop a pile of other slices"
          css={css`
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
          `}
        />
        <canvas
          ref={canvasRef}
          css={css`
            position: absolute;
            background: black;
            z-index: 2;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.5;
          `}
          onMouseDown={() => setDrawing(true)}
          onMouseUp={() => setDrawing(false)}
          onMouseMove={onMouseMove}
        />
      </div>

      {/*<div>*/}
      {/*  <div css={css`*/}
      {/*    position: relative;*/}
      {/*  `}>*/}
      {/*    <div css={css`*/}
      {/*      background: bisque;*/}
      {/*      width: 16rem;*/}
      {/*      height: 9rem;*/}
      {/*    `}/>*/}
      {/*    <div css={css`*/}
      {/*      position: absolute;*/}
      {/*      bottom: 0;*/}
      {/*      left: 0;*/}
      {/*      margin: 0.5rem;*/}
      {/*      background: black;*/}
      {/*      width: 1rem;*/}
      {/*      height: 1rem;*/}
      {/*    `}/>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  )
}
