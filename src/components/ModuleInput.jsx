export default function ModuleInput({
  item,
  selectedValue,
  customText,
  onChange,
  onCustomTextChange
}) {
  // 1. Render Geometry Toggle
  if (item.type === 'toggle') {
    const isPreserved = selectedValue === true;
    return (
      <div className="py-6 border-b border-zinc-100 last:border-b-0">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-2.5">
          {item.title}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange(item.id, false)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
              !isPreserved
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
            }`}
          >
            No
          </button>
          <button
            onClick={() => onChange(item.id, true)}
            className={`px-4 py-1.5 rounded-full text-xs font-sans font-semibold border transition-all cursor-pointer ${
              isPreserved
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-400 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700"
            }`}
          >
            Yes
          </button>
        </div>
      </div>
    );
  }

  // 2. Render Materiality Multi-Select
  if (item.type === 'multi-select') {
    const selectedIds = Array.isArray(selectedValue) ? selectedValue : [];
    return (
      <div className="py-6 border-b border-zinc-100 last:border-b-0">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
          {item.title}
        </span>
        <div className="flex flex-wrap gap-2">
          {item.options?.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onChange(item.id, option.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 cursor-pointer border ${
                  isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-450 hover:text-zinc-800"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={customText || ""}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder="Additional materials (e.g. polished brass, Venetian plaster)..."
          className="w-full mt-3 px-1 py-2 border-b border-zinc-200 focus:border-black text-xs font-sans text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none transition-all"
        />
      </div>
    );
  }

  // 3. Render Standard Single-Select (with inline text tags)
  return (
    <div className="py-6 border-b border-zinc-100 last:border-b-0">
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
        {item.title}
      </span>
      <div className="flex flex-wrap gap-2">
        {item.options?.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(item.id, option.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all duration-150 cursor-pointer border ${
                isSelected
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                  : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-450 hover:text-zinc-800"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {selectedValue === "custom" && (
        <input
          type="text"
          value={customText || ""}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder="Type custom specification here..."
          className="w-full mt-3 px-1 py-2 border-b border-zinc-200 focus:border-black text-xs font-sans text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none transition-all animate-in fade-in duration-150"
        />
      )}
    </div>
  );
}
