import { Slider } from "@/components/ui/slider"
import {css} from "@emotion/react";
import {HStack} from "@/lib/style/layouts.tsx";
import {Button} from "@/components/ui/button.tsx";

interface SketchToolsPros {
  lineWidth: number[];
  setLineWidth: (v: number[]) => void;
  setStrokeStyle: (v: string) => void;
  clearCanvas: () => void;
}

export function SketchTools({ lineWidth, setLineWidth, setStrokeStyle, clearCanvas }: SketchToolsPros) {

  return (
    <HStack css={css`
      margin: 1rem;
    `}>
      <HStack>
        <Slider css={css`
          width: 10rem;
        `}
          value={lineWidth} defaultValue={lineWidth}
          onValueChange={v => setLineWidth(v)}
          max={10} step={0.1}
        />
        <div>
          {lineWidth[0]}
        </div>
      </HStack>
      <HStack>
        <div
          className="rounded-full w-7 h-7 cursor-pointer"
          css={{background: "#000000"}}
          onClick={() => setStrokeStyle("#000000")}
        />
        <div
          className="rounded-full w-7 h-7 cursor-pointer"
          css={{background: "#ffffff", borderColor: "#000000", borderWidth: "0.1rem"}}
          onClick={() => setStrokeStyle("#ffffff")}
        />
        <div
          className="rounded-full w-7 h-7 cursor-pointer"
          css={{background: "#ff0000"}}
          onClick={() => setStrokeStyle("#ff0000")}
        />
        <div
          className="rounded-full w-7 h-7 cursor-pointer"
          css={{background: "#00ff00"}}
          onClick={() => setStrokeStyle("#00ff00")}
        />
      </HStack>
      <div>
        <Button onClick={clearCanvas}>clear</Button>
      </div>
    </HStack>
  )
}