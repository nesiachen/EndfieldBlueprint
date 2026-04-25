import { useEffect, useState, Fragment } from "react";
import { GRID_CELL_SIZE } from "../core/grid";
import { Layer, Stage, Line, Text } from "react-konva";

export default function Canvas() {
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cols = Math.ceil(stageSize.width / GRID_CELL_SIZE) + 1;
  const rows = Math.ceil(stageSize.height / GRID_CELL_SIZE) + 1;

  const verticalLines: number[] = [];
  for (let i = 0; i < cols; i++) {
    const x = i * GRID_CELL_SIZE;
    verticalLines.push(x, 0, x, stageSize.height);
  }
  const horizontalLines: number[] = [];
  for (let i = 0; i < rows; i++) {
    const y = i * GRID_CELL_SIZE;
    horizontalLines.push(0, y, stageSize.width, y);
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {stageSize.width > 0 && (
        <Stage width={stageSize.width} height={stageSize.height}>
          <Layer>
            {Array.from({ length: cols }, (_, i) => {
              const x = i * GRID_CELL_SIZE;
              return (
                <Fragment key={`col${i}`}>
                  <Line points={[x, 0, x, stageSize.height]} stroke="#e0e0e0" strokeWidth={1} listening={false} />
                  {i % 5 === 0 && <Text x={x + 2} y={2} text={String(i)} fontSize={10} fill="#888" listening={false} />}
                </Fragment>
              );
            })}
            {Array.from({ length: rows }, (_, i) => {
              const y = i * GRID_CELL_SIZE;
              return (
                <Fragment key={`col${i}`}>
                  <Line points={[0, y, stageSize.width, y]} stroke="#e0e0e0" strokeWidth={1} listening={false} />
                  {i % 5 === 0 && <Text x={2} y={y + 2} text={String(i)} fontSize={10} fill="#888" listening={false} />}
                </Fragment>
              );
            })}
          </Layer>
        </Stage>
      )}
    </div>
  );
}
