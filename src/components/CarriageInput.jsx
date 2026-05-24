export default function CarriageInput({
  item,
  selectedValue,
  customText,
  onChange,
  onCustomTextChange,
  isCollapsed,
  onToggleCollapse
}) {
  if (isCollapsed && selectedValue) {
    const selectedOption = item.options?.find(opt => opt.id === selectedValue);
    const displayValue = selectedValue === "custom"
      ? (customText ? `Custom: "${customText}"` : "Custom (empty)")
      : (selectedOption ? selectedOption.label : "Not configured");

    return (
      <div className="mb-4 p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all flex justify-between items-center group/item shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col pr-4 overflow-hidden">
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400">
            {item.title}
          </span>
          <span className="text-sm font-sans font-semibold text-zinc-800 truncate mt-0.5">
            {displayValue}
          </span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="text-xs font-sans font-bold text-zinc-500 hover:text-black hover:bg-zinc-100 py-1.5 px-3 rounded-lg transition-all"
        >
          Configure
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 p-5 rounded-2xl border border-zinc-200 bg-white/40 transition-all shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
        <h3 className="text-xs font-display font-bold text-zinc-900 tracking-wider uppercase">
          {item.title}
        </h3>
        {selectedValue && (
          <button
            onClick={onToggleCollapse}
            className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 hover:text-black py-1 px-2.5 hover:bg-zinc-100 rounded transition-all"
          >
            Collapse
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {item.options?.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              onClick={() => {
                onChange(item.id, option.id);
                if (option.id !== "custom") {
                  // Subtle delay for sensory feedback before auto-collapsing
                  setTimeout(() => onToggleCollapse(), 180);
                }
              }}
              className={`text-left p-3.5 rounded-xl border transition-all duration-200 ease-out cursor-pointer
                ${isSelected
                  ? "border-black bg-black text-white shadow-md ring-2 ring-black/5 ring-offset-1 ring-offset-zinc-50"
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-sm hover:text-zinc-800"
                }`}
            >
              <div className="font-sans font-medium text-xs sm:text-sm leading-snug">{option.label}</div>
            </button>
          );
        })}
      </div>

      {selectedValue === "custom" && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <textarea
            value={customText || ""}
            onChange={(e) => onCustomTextChange(item.id, e.target.value)}
            placeholder="Type specific details here..."
            className="w-full p-4 border border-zinc-200 rounded-xl bg-white text-zinc-900 font-sans text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none h-24 transition-all shadow-inner"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={onToggleCollapse}
              className="text-[10px] font-sans font-bold uppercase tracking-wider text-black bg-zinc-100 hover:bg-zinc-200 py-1.5 px-3.5 rounded-lg transition-all cursor-pointer"
            >
              Done Editing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
