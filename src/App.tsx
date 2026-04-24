import { useState } from "react";
import "./App.css";
import { GridCanvas } from "./components/GridLayout/GridCanvas";
import { EquipmentBar } from "./components/UI/EquipmentBar";
import type { Device, GridConfig } from "./types/layout";

const gridconfig: GridConfig = {
  baseCellSize: 30,
  cellRows: 80,
  cellCols: 80,
  minScale: 0.5,
  maxScale: 3,
  snapToGrid: true,
};

function App() {
  const [device, setDevices] = useState<Device[]>([]);

  const handleAddDevice = (templateId: string, gridX: number, gridY: number) => {
    const newDevice: Device = {
      id: `device_${Date.now()}`,
      templateId,
      x: gridX,
      y: gridY,
      rotation: 0,
    };
    setDevices((prev) => [...prev, newDevice]);
  };
  return (
    <div className="app-container">
      {/* Equipment Sidebar */}
      <aside className="sidebar">
        <EquipmentBar />
      </aside>
      {/* Grid  Canvas*/}
      <main className="canvas">
        <GridCanvas gridconfig={gridconfig} devices={device} onAddDevice={handleAddDevice} />
      </main>
    </div>
  );
}

export default App;
