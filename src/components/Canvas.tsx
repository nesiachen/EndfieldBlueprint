import { useEffect, useState, Fragment, useRef } from "react";
import { GRID_CELL_SIZE, pixelToGrid } from "../core/grid";
import { Layer, Stage, Line, Text, Rect, Group, Circle, Arrow } from "react-konva";
import type { PlacedDevice } from "../types";
import { equipmentCatalog } from "../data/equipment";
import { getDeviceIOPorts } from "../core/io";

interface CanvasProps {
  selectedTemplateId: string | null;
  placedDevices: PlacedDevice[];
  onPlaceDevice: (x: number, y: number) => void;
}

export default function Canvas({ selectedTemplateId, placedDevices, onPlaceDevice }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      setStageSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const cols = Math.ceil(stageSize.width / GRID_CELL_SIZE) + 1;
  const rows = Math.ceil(stageSize.height / GRID_CELL_SIZE) + 1;

  function handleStageClick(e: { evt: MouseEvent }) {
    if (!selectedTemplateId) return;
    const pos = pixelToGrid(e.evt.offsetX, e.evt.offsetY);
    onPlaceDevice(pos.x, pos.y);
  }

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <Stage width={stageSize.width} height={stageSize.height} onClick={handleStageClick}>
        {/* 网格层 */}
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
              <Fragment key={`row${i}`}>
                <Line points={[0, y, stageSize.width, y]} stroke="#e0e0e0" strokeWidth={1} listening={false} />
                {i % 5 === 0 && <Text x={2} y={y + 2} text={String(i)} fontSize={10} fill="#888" listening={false} />}
              </Fragment>
            );
          })}
        </Layer>
        {/* 设备层 */}
        <Layer>
          {placedDevices.map((d) => {
            const tmpl = equipmentCatalog[d.templateId];
            const px = d.x * GRID_CELL_SIZE;
            const py = d.y * GRID_CELL_SIZE;
            const w = tmpl.cols * GRID_CELL_SIZE;
            const h = tmpl.rows * GRID_CELL_SIZE;
            return <Rect key={d.id} x={px} y={py} width={w} height={h} fill="rgba(100, 180, 255, 0.3)" stroke="#4a9eff" strokeWidth={2} />;
          })}
          {placedDevices.map((d) => {
            const tmpl = equipmentCatalog[d.templateId];
            const px = d.x * GRID_CELL_SIZE;
            const py = d.y * GRID_CELL_SIZE;
            return <Text key={`name_${d.id}`} x={px + 4} y={py + 4} text={tmpl.name} fontSize={12} fill="#fff" listening={false} />;
          })}
        </Layer>
        {/* IO口层 */}
        <Layer>
          {placedDevices.map((d) => {
            const tmpl = equipmentCatalog[d.templateId];
            if (!tmpl) return null;
            return getDeviceIOPorts(d, tmpl).map((port) => {
              const cx = port.x * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
              const cy = port.y * GRID_CELL_SIZE + GRID_CELL_SIZE / 2;
              const isLiquid = port.type === "LIQUID_INPUT" || port.type === "LIQUID_OUTPUT";
              const color = isLiquid ? "#ff9800" : "#4caf50";

              const inputArrow: Record<string, number[]> = {
                up: [0, 3, 0, -5],
                down: [0, -3, 0, 5],
                left: [3, 0, -5, 0],
                right: [-3, 0, 5, 0],
              };
              const outputArrow: Record<string, number[]> = {
                up: [0, -3, 0, 5],
                down: [0, 3, 0, -5],
                left: [-3, 0, 5, 0],
                right: [3, 0, -5, 0],
              };
              const isOutput = port.type === "SOLID_OUTPUT" || port.type === "LIQUID_OUTPUT";
              const points = (isOutput ? outputArrow : inputArrow)[port.direction] ?? [0, 0, 0, 0];

              return (
                <Group key={`${d.id}-${port.side}${port.sideIndex}`} x={cx} y={cy}>
                  <Circle radius={8} stroke={color} strokeWidth={1.5} fill="transparent" listening={false} />
                  <Arrow points={points} stroke={color} fill={color} pointerLength={5} pointerWidth={5} listening={false} />
                </Group>
              );
            });
          })}
        </Layer>
      </Stage>
    </div>
  );
}
