import { useCallback, useEffect, useState } from "react";
import Canvas from "./components/Canvas";
import EquipmentBar from "./components/EquipmentBar";
import type { BeltInstance, GridCoord, IOPort, PlacedDevice } from "./types";
import { equipmentCatalog } from "./data/equipment";
import { checkCollision, generateDeviceId } from "./core/placement";
import { generateBeltId } from "./core/belt";

export default function App() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [placedDevices, setPlacedDevices] = useState<PlacedDevice[]>([]);
  const [belts, setBelts] = useState<BeltInstance[]>([]);
  const [selectBeltTemplateId, setSelectedBeltTemplateId] = useState<string>("belt");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "1") setSelectedBeltTemplateId("belt");
      if (e.key === "2") setSelectedBeltTemplateId("pipe");
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

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

  const handlePlaceBelt = useCallback(
    (startPort: IOPort, endPort: IOPort, waypoints: GridCoord[]) => {
      setBelts((prev) => [
        ...prev,
        {
          id: generateBeltId(),
          startDeviceId: startPort.deviceId,
          endDeviceId: endPort.deviceId,
          waypoints,
          templateId: selectBeltTemplateId,
        },
      ]);
    },
    [selectBeltTemplateId],
  );

  return (
    <div style={{ width: "100%", height: "100vh", display: "flex" }}>
      <EquipmentBar selectedTemplateId={selectedTemplateId} onSelectedTemplate={setSelectedTemplateId} />
      <Canvas
        selectedTemplateId={selectedTemplateId}
        placedDevices={placedDevices}
        onPlaceDevice={handlePlaceDevice}
        belts={belts}
        onPlaceBelt={handlePlaceBelt}
        selectedBeltTemplateId={selectBeltTemplateId}
        onChangeBeltMode={setSelectedBeltTemplateId}
      />
    </div>
  );
}
