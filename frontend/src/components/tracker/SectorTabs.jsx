import { useState } from "react";
import { Plus, X, Pencil } from "lucide-react";

const SectorTabs = ({ sectors, activeSector, onSelectSector, onAddSector, onEditSector, onDeleteSector }) => {
  const [hoverId, setHoverId] = useState(null);

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {sectors.map((sector) => (
        <div
          key={sector._id}
          className="relative"
          onMouseEnter={() => setHoverId(sector._id)}
          onMouseLeave={() => setHoverId(null)}
        >
          <button
            onClick={() => onSelectSector(sector)}
            className={`focus-ring inline-flex items-center gap-2 pl-3.5 pr-2.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activeSector?._id === sector._id
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            {sector.name}
            {hoverId === sector._id && (
              <span className="flex items-center gap-0.5 ml-1">
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditSector(sector);
                  }}
                  className={`h-5 w-5 rounded flex items-center justify-center ${
                    activeSector?._id === sector._id
                      ? "hover:bg-white/15"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <Pencil size={11} />
                </span>
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSector(sector);
                  }}
                  className={`h-5 w-5 rounded flex items-center justify-center ${
                    activeSector?._id === sector._id
                      ? "hover:bg-white/15"
                      : "hover:bg-negative-50 hover:text-negative-600"
                  }`}
                >
                  <X size={12} />
                </span>
              </span>
            )}
          </button>
        </div>
      ))}

      <button
        onClick={onAddSector}
        className="focus-ring inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium border border-dashed border-slate-300 text-slate-500 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50/50 transition-colors"
      >
        <Plus size={14} />
        Add sector
      </button>
    </div>
  );
};

export default SectorTabs;
