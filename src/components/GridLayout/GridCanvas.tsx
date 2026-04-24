import { useState, useRef, useEffect, useMemo } from "react";
import { Stage, Layer, Line, Rect } from "react-konva";

import type { GridConfig, Device } from "../../types/layout";
import { equipmentCatalog } from "../../data/equipment";
import { Device as DeviceComponent } from "./Device";

interface Props {
  gridconfig: GridConfig;
  devices: Device[];
  onAddDevice: (templateId: string, gridX: number, gridY: number) => void;
}

export const GridCanvas = ({ gridconfig, devices, onAddDevice }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [stageX, setStageX] = useState(0);
  const [stageY, setStageY] = useState(0);

  const { baseCellSize, cellRows, cellCols } = gridconfig;

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const gridLines = useMemo(() => {
    const lines: { points: number[]; key: string }[] = [];
    const totalW = cellCols * baseCellSize;
    const totalH = cellRows * baseCellSize;

    for (let i = 0; i <= cellCols; i++) {
      lines.push({ key: `v${i}`, points: [i * baseCellSize, 0, i * baseCellSize, totalH] });
    }
    for (let i = 0; i <= cellRows; i++) {
      lines.push({ key: `h${i}`, points: [0, i * baseCellSize, totalW, i * baseCellSize] });
    }

    return lines;
  }, [cellCols, cellRows, baseCellSize]);

  const totalW = cellCols * baseCellSize;
  const totalH = cellRows * baseCellSize;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent) => {
    const templateId = e.dataTransfer.getData("text/plain");
    if (!templateId) return;

    const rect = containerRef.current!.getBoundingClientRect();
    const px = (e.clientX - rect.left - stageX) / scale;
    const py = (e.clientY - rect.top - stageY) / scale;

    const col = Math.round(px / baseCellSize);
    const row = Math.round(py / baseCellSize);

    onAddDevice(templateId, col, row);
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }} onDragOver={handleDragOver} onDrop={handleDrop}>
      <Stage
        ref={stageRef}
        width={size.width}
        height={size.height}
        onWheel={(e) => {
          e.evt.preventDefault();
          const pointer = e.target.getStage()?.getPointerPosition();
          if (!pointer) return;
          const oldScale = scale;
          const newScale = Math.min(gridconfig.maxScale, Math.max(gridconfig.minScale, e.evt.deltaY > 0 ? oldScale * 0.9 : oldScale * 1.1));
          setStageX(pointer.x - (pointer.x - stageX) * (newScale / oldScale));
          setStageY(pointer.y - (pointer.y - stageY) * (newScale / oldScale));
          setScale(newScale);
        }}
      >
        <Layer
          draggable
          x={stageX}
          y={stageY}
          scaleX={scale}
          scaleY={scale}
          onDragEnd={(e) => {
            setStageX(e.target.x());
            setStageY(e.target.y());
          }}
        >
          <Rect x={0} y={0} width={totalW} height={totalH} fill="transparent" listening={true} />
          {gridLines.map((line) => (
            <Line key={line.key} points={line.points} stroke="#e0e0e0" strokeWidth={3} />
          ))}
          {devices.map((d) => {
            const tmpl = equipmentCatalog[d.templateId];
            if (!tmpl) return null;
            return <DeviceComponent key={d.id} template={tmpl} gridX={d.x} gridY={d.y} cellSize={baseCellSize} />;
          })}
        </Layer>
      </Stage>
    </div>
  );
};
