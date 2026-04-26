import { useCallback, useState } from "react";
import Canvas from "./components/Canvas";
import EquipmentBar from "./components/EquipmentBar";
import type { PlacedDevice } from "./types";
import { equipmentCatalog } from "./data/equipment";
import { checkCollision, generateDeviceId } from "./core/placement";

export default function App() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([]);

  const handlePlaceDevice = useCallback(
    (x: number, y: number) => {
      if (!selectedTemplateId) return;

      const tmpl = equipmentCatalog[selectedTemplateId];
      if (!tmpl) return;

      if (checkCollision(x, y, tmpl.cols, tmpl.rows, placedDevices)) return;

      setPlacedDevices((prev) => [...prev, { id: generateDeviceId(), templateId: selectedTemplateId, x, y }]);
    },
    [selectedTemplateId, placedDevices],
  );
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex" }}>
      <EquipmentBar selectedTemplateId={selectedTemplateId} onSelectedTemplate={setSelectedTemplateId} />
      <Canvas selectedTemplateId={selectedTemplateId} placedDevices={placedDevices} onPlaceDevice={handlePlaceDevice} />
    </div>
  );
}
