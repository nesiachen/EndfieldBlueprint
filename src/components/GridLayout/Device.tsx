import { Group, Rect, Text } from "react-konva";

import type { EquipmentTemplate } from "../../data/equipment";
import { PortType } from "../../types/portType";

interface DeviceProps {
  template: EquipmentTemplate;
  gridX: number;
  gridY: number;
  cellSize: number;
}

const PORT_COLORS: Record<string, string> = {
  solid_input: "#e67e22",
  solid_output: "#e67e22",
  liquid_input: "#3498db",
  liquid_output: "#3498db",
};

export const Device = ({ template, gridX, gridY, cellSize }: DeviceProps) => {
  const w = template.length * cellSize;
  const h = template.width * cellSize;

  const renderPorts = () => {
    const half = cellSize / 2;
    const ports: React.ReactNode[] = [];

    // top
    template.ioSides.top.forEach((type, i) => {
      if (type === PortType.NONE) return;
      ports.push(<Rect key={`top-${i}`} x={i * cellSize} y={0} width={cellSize} height={half} fill="transparent" stroke={PORT_COLORS[type]} strokeWidth={2} />);
    });

    // bottom
    template.ioSides.bottom.forEach((type, i) => {
      if (type === PortType.NONE) return;
      ports.push(
        <Rect key={`bottom-${i}`} x={i * cellSize} y={h - half} width={cellSize} height={half} fill="transparent" stroke={PORT_COLORS[type]} strokeWidth={2} />,
      );
    });

    // left
    template.ioSides.left.forEach((type, i) => {
      if (type === PortType.NONE) return;
      ports.push(
        <Rect key={`left-${i}`} x={0} y={i * cellSize} width={half} height={cellSize} fill="transparent" stroke={PORT_COLORS[type]} strokeWidth={2} />,
      );
    });

    // right
    template.ioSides.right.forEach((type, i) => {
      if (type === PortType.NONE) return;
      ports.push(
        <Rect key={`right-${i}`} x={w - half} y={i * cellSize} width={half} height={cellSize} fill="transparent" stroke={PORT_COLORS[type]} strokeWidth={2} />,
      );
    });

    return ports;
  };

  return (
    <Group x={gridX * cellSize} y={gridY * cellSize}>
      <Rect x={0} y={0} width={w} height={h} fill="transparent" stroke="#2c3e50" strokeWidth={2} />
      {renderPorts()}
      <Text x={0} y={0} width={w} height={h} text={template.name} fontSize={12} fill="black" align="center" verticalAlign="middle" />
    </Group>
  );
};
