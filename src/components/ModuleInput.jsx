export default function ModuleInput({
  item,
  selectedValue,
  customText,
  onChange,
  onCustomTextChange,
  index
}) {
  const formattedIndex = index !== undefined ? `${String(index).padStart(2, '0')} / ` : '';

  // 1. Render Materiality Multi-Select
  if (item.type === 'multi-select') {
    const selectedIds = Array.isArray(selectedValue) ? selectedValue : [];
    return (
      <div className="py-4">
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
          <span className="text-zinc-500 font-extrabold">{formattedIndex}</span>
          {item.title}
        </span>
        <div className="flex flex-wrap gap-3">
          {item.options?.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            return (
              <button
                key={option.id}
                onClick={() => onChange(item.id, option.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-150 cursor-pointer border ${
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
          className="w-full mt-3 px-1 py-2 border-b border-zinc-200 focus:border-zinc-950 text-xs font-sans text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none transition-all"
        />
      </div>
    );
  }

  // 2. Render Standard Single-Select (with allowDetailInput support)
  return (
    <div className="py-4">
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
        <span className="text-zinc-500 font-extrabold">{formattedIndex}</span>
        {item.title}
      </span>
      <div className="flex flex-wrap gap-3">
        {item.options?.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(item.id, option.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-150 cursor-pointer border ${
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
      
      {item.allowDetailInput && (
        <input
          type="text"
          value={customText || ""}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder={`Supplementary details (e.g. specify context for ${item.title.toLowerCase()})...`}
          className="w-full mt-3 px-1 py-2 border-b border-zinc-200 focus:border-zinc-950 text-xs font-sans text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none transition-all"
        />
      )}

      {!item.allowDetailInput && selectedValue === "custom" && (
        <input
          type="text"
          value={customText || ""}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder="Type custom specification here..."
          className="w-full mt-3 px-1 py-2 border-b border-zinc-200 focus:border-zinc-950 text-xs font-sans text-zinc-800 placeholder-zinc-400 bg-transparent focus:outline-none transition-all animate-in fade-in duration-150"
        />
      )}
    </div>
  );
}
