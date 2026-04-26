import { equipmentCatalog, type EquipmentTemplate } from "../data/equipment";

interface EquipmentProps {
  selectedTemplateId: string | null;
  onSelectedTemplate: (id: string | null) => void;
}

function groupByCategory(catalog: Record<string, EquipmentTemplate>): Record<string, [string, EquipmentTemplate][]> {
  const groups: Record<string, [string, EquipmentTemplate][]> = {};

  for (const [id, tmpl] of Object.entries(catalog)) {
    if (!groups[tmpl.category]) groups[tmpl.category] = [];
    groups[tmpl.category].push([id, tmpl]);
  }

  return groups;
}

export default function EquipmentBar({ selectedTemplateId, onSelectedTemplate }: EquipmentProps) {
  const groups = groupByCategory(equipmentCatalog);

  return (
    <div
      style={{
        left: 0,
        top: 0,
        width: 200,
        height: "100vh",
        background: "#1a1a2e",
        color: "#eee",
        padding: 12,
        overflowY: "auto",
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      <h2 style={{ fontSize: 16, marginBottom: 12, borderBottom: "1px solid #333", paddingBottom: 8 }}>设备列表</h2>
      {Object.entries(groups).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>{category}</h3>
          {items.map(([id, tmpl]) => (
            <div
              key={id}
              onClick={() => onSelectedTemplate(id === selectedTemplateId ? null : id)}
              style={{
                padding: "6px 6px",
                marginBottom: 4,
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                background: id === selectedTemplateId ? "#3a3a5e" : "transparent",
                border: id === selectedTemplateId ? "1px solid #6a6a9e" : "1px solid transparent",
              }}
            >
              <div>{tmpl.name}</div>
              <div style={{ fontSize: 11, color: "#888" }}>
                {tmpl.cols} * {tmpl.rows}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
