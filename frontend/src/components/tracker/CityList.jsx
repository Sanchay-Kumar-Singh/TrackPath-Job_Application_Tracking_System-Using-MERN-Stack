import { useState } from "react";
import { MapPin, Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";

const CityList = ({ cities, activeCity, onSelectCity, onAddCity, onEditCity, onDeleteCity }) => {
  const [menuOpenId, setMenuOpenId] = useState(null);

  return (
    <div className="bg-white border border-slate-200 rounded-xl2 shadow-panel overflow-hidden">
      <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <h2 className="font-display font-semibold text-ink-900 text-sm">Cities</h2>
        <button
          onClick={onAddCity}
          className="focus-ring h-7 w-7 rounded-md bg-brand-50 text-brand-600 hover:bg-brand-100 flex items-center justify-center transition-colors"
          title="Add city"
        >
          <Plus size={15} />
        </button>
      </div>

      <div className="p-2 max-h-[calc(100vh-180px)] overflow-y-auto">
        {cities.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MapPin size={20} className="text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">No cities yet. Add your first one.</p>
          </div>
        ) : (
          cities.map((city) => (
            <div key={city._id} className="relative group">
              <button
                onClick={() => onSelectCity(city)}
                className={`focus-ring w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors mb-0.5 ${
                  activeCity?._id === city._id
                    ? "bg-brand-50 text-brand-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MapPin
                  size={15}
                  className={activeCity?._id === city._id ? "text-brand-600" : "text-slate-400"}
                />
                <span className="truncate flex-1 text-left">{city.name}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpenId(menuOpenId === city._id ? null : city._id);
                }}
                className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical size={14} />
              </button>

              {menuOpenId === city._id && (
                <div className="absolute right-2 top-9 z-20 w-36 bg-white border border-slate-200 rounded-lg shadow-popover py-1">
                  <button
                    onClick={() => {
                      onEditCity(city);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
                  >
                    <Pencil size={12} /> Rename
                  </button>
                  <button
                    onClick={() => {
                      onDeleteCity(city);
                      setMenuOpenId(null);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-negative-600 hover:bg-negative-50"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CityList;
