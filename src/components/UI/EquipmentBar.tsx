import { useState } from "react";

import { equipmentCatalog } from "../../data/equipment";
import type { EquipmentTemplate } from "../../data/equipment";

function groupByCategory() {
  const map = new Map<string, EquipmentTemplate[]>();
  for (const tmpl of Object.values(equipmentCatalog)) {
    if (!map.has(tmpl.category)) map.set(tmpl.category, []);
    map.get(tmpl.category)!.push(tmpl);
  }
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }));
}

export const EquipmentBar = () => {
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const categories = groupByCategory();

  const toggle = (name: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  return (
    <div className="equipmentbar">
      <h3>设备列表</h3>
      {categories.map((cat) => (
        <div key={cat.name}>
          <div
            className="category-header"
            onClick={() => toggle(cat.name)}
            style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "6", padding: "8px 12px" }}
          >
            {openSet.has(cat.name) ? (
              <svg width={12} height={12} viewBox="0 0 12 12">
                <path d="M2 4 L6 9 L10 4" fill="none" stroke="currentColor" strokeWidth={2} />
              </svg>
            ) : (
              <svg width={12} height={12} viewBox="0 0 12 12">
                <path d="M4 2 L9 6 L4 10" fill="none" stroke="currentColor" strokeWidth={2} />
              </svg>
            )}
            <span>{cat.name}</span>
          </div>
          {openSet.has(cat.name) && (
            <div className="category-items" style={{ paddingLeft: 12 }}>
              {cat.items.map((item) => (
                <div
                  className="device-item"
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item.id)}
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 12px" }}
                >
                  <span className="device-icon">{item.icon}</span>
                  <span>{item.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: 12, opacity: 0.6 }}>
                    {item.length} * {item.width}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
