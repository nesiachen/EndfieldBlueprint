import { useEffect, useState, Fragment, useRef } from "react";
import { GRID_CELL_SIZE, pixelToGrid } from "../core/grid";
import { Layer, Stage, Line, Text, Rect, Group, Circle, Arrow } from "react-konva";
import type { BeltInstance, GridCoord, IOPort, PlacedDevice } from "../types";
import { equipmentCatalog } from "../data/equipment";
import { getDeviceIOPorts } from "../core/io";
import { validateBeltConnection } from "../core/belt";

interface CanvasProps {
  selectedTemplateId: string | null;
  placedDevices: PlacedDevice[];
  onPlaceDevice: (x: number, y: number) => void;
  belts: BeltInstance[];
  onPlaceBelt: (startPort: IOPort, endPort: IOPort, waypoints: GridCoord[]) => void;
  selectedBeltTemplateId: string;
  onChangeBeltMode: (id: string) => void;
}

export default function Canvas({
  selectedTemplateId,
  placedDevices,
  onPlaceDevice,
  belts,
  onPlaceBelt,
  selectedBeltTemplateId,
  onChangeBeltMode,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [beltBuilder, setBeltBuilder] = useState<{
    startPort: IOPort;
    waypoints: GridCoord[];
    previewPos: GridCoord | null;
  } | null>(null);

  const cols = Math.ceil(stageSize.width / GRID_CELL_SIZE) + 1;
  const rows = Math.ceil(stageSize.height / GRID_CELL_SIZE) + 1;

  function snapToGrid(from: GridCoord, to: GridCoord): GridCoord {
    const dx = Math.abs(to.x - from.x);
    const dy = Math.abs(to.y - from.y);
    return dx > dy ? { x: to.x, y: from.y } : { x: from.x, y: to.y };
  }

  function getBeltColor(templateId: string): string {
    return templateId === "pipe" ? "#ff9800" : "#4caf50";
  }
  function waypointsToPoints(waypoints: GridCoord[]): number[] {
    const points: number[] = [];
    for (const p of waypoints) {
      points.push(p.x * GRID_CELL_SIZE + GRID_CELL_SIZE / 2, p.y * GRID_CELL_SIZE + GRID_CELL_SIZE / 2);
    }
    return points;
  }

  function handleStageClick(e: { evt: MouseEvent }) {
    if (beltBuilder) {
      if (beltBuilder.previewPos) {
        setBeltBuilder((prev) =>
          prev
            ? {
                ...prev,
                waypoints: [...prev.waypoints, prev.previewPos!],
                previewPos: null,
              }
            : null,
        );
      }
      return;
    }
    if (!selectedTemplateId) return;
    const pos = pixelToGrid(e.evt.offsetX, e.evt.offsetY);
    onPlaceDevice(pos.x, pos.y);
  }

  function handleStageContextMenu(e: { evt: MouseEvent }) {
    e.evt.preventDefault();
    setBeltBuilder(null);
  }

  useEffect(() => {
    function updateSize() {
      if (!containerRef.current) return;
      setStageSize({ width: containerRef.current.clientWidth, height: containerRef.current.clientHeight });
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (!beltBuilder) return;
    const container = containerRef.current;
    if (!container) return;
    function onMouseMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      const mouse = pixelToGrid(e.clientX - rect.left, e.clientY - rect.top);
      const last = beltBuilder!.waypoints[beltBuilder!.waypoints.length - 1];
      setBeltBuilder((prev) => (prev ? { ...prev, previewPos: snapToGrid(last, mouse) } : null));
    }
    container.addEventListener("mousemove", onMouseMove);
    return () => container.removeEventListener("mousemove", onMouseMove);
  }, [beltBuilder]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {beltBuilder && (
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(0, 0, 0, 0.6)",
            color: "#fff",
            padding: "4px 10px",
            borderRadius: 4,
            fontSize: 13,
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          {selectedBeltTemplateId === "belt" ? "传送带" : "管道"}
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
        <Stage width={stageSize.width} height={stageSize.height} onClick={handleStageClick} onContextMenu={handleStageContextMenu}>
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
                    <Circle
                      radius={8}
                      stroke={color}
                      strokeWidth={1.5}
                      fill="transparent"
                      listening={true}
                      onClick={(e) => {
                        e.cancelBubble = true;
                        if (!beltBuilder) {
                          if (port.type === "SOLID_OUTPUT" || port.type === "LIQUID_OUTPUT") {
                            onChangeBeltMode(port.type === "SOLID_OUTPUT" ? "belt" : "pipe");
                            setBeltBuilder({
                              startPort: port,
                              waypoints: [{ x: port.x, y: port.y }],
                              previewPos: null,
                            });
                          }
                        } else {
                          const lastWaypoint = beltBuilder.waypoints[beltBuilder.waypoints.length - 1];
                          const targetPos = { x: port.x, y: port.y };
                          if (lastWaypoint.x !== targetPos.x && lastWaypoint.y !== targetPos.y) {
                            return;
                          }
                          const allWaypoints = [...beltBuilder.waypoints, { x: port.x, y: port.y }];
                          const result = validateBeltConnection(beltBuilder.startPort, port);
                          if (result.valid) {
                            onPlaceBelt(beltBuilder.startPort, port, allWaypoints);
                          }
                          setBeltBuilder(null);
                        }
                      }}
                    />
                    <Arrow points={points} stroke={color} fill={color} pointerLength={5} pointerWidth={5} listening={false} />
                  </Group>
                );
              });
            })}
          </Layer>
          {/* 传送带层 */}
          <Layer>
            {belts.map((belt) => {
              const points = waypointsToPoints(belt.waypoints);
              return (
                <Line key={belt.id} points={points} stroke={getBeltColor(belt.templateId)} strokeWidth={8} lineCap="round" lineJoin="round" listening={false} />
              );
            })}
            {/* 画线中已确定的线段 */}
            {beltBuilder &&
              beltBuilder.waypoints.length > 1 &&
              (() => {
                const points = waypointsToPoints(beltBuilder.waypoints);
                return (
                  <Line points={points} stroke={getBeltColor(selectedBeltTemplateId)} strokeWidth={4} lineCap="round" lineJoin="round" listening={false} />
                );
              })()}
            {/* 预览地块 */}
            {beltBuilder &&
              beltBuilder.previewPos &&
              (() => {
                return (
                  <Rect
                    x={beltBuilder.previewPos!.x * GRID_CELL_SIZE}
                    y={beltBuilder.previewPos!.y * GRID_CELL_SIZE}
                    width={GRID_CELL_SIZE}
                    height={GRID_CELL_SIZE}
                    fill={getBeltColor(selectedBeltTemplateId) + "66"}
                    stroke={getBeltColor(selectedBeltTemplateId)}
                    strokeWidth={1}
                    listening={false}
                  />
                );
              })()}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
