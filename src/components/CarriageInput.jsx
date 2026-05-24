export default function CarriageInput({
  item,
  selectedValue,
  customText,
  onChange,
  onCustomTextChange
}) {
  return (
    <div className="mb-10 last:mb-0">
      <h3 className="text-sm font-display font-bold text-zinc-900 mb-4 tracking-wider uppercase">{item.title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {item.options.map((option) => {
          const isSelected = selectedValue === option.id;
          return (
            <button
              key={option.id}
              onClick={() => onChange(item.id, option.id)}
              className={`text-left p-4 rounded-xl border transition-all duration-200 ease-out
                ${isSelected 
                  ? "border-black bg-black text-white shadow-md ring-2 ring-black/10 ring-offset-2 ring-offset-stone-50" 
                  : "border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:-translate-y-0.5 hover:shadow-sm hover:text-zinc-800"
                }`}
            >
              <div className="font-sans font-medium text-sm leading-snug">{option.label}</div>
            </button>
          );
        })}
      </div>
      
      {/* Conditional rendering for custom input */}
      {selectedValue === "custom" && (
        <div className="mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <textarea
            value={customText || ""}
            onChange={(e) => onCustomTextChange(item.id, e.target.value)}
            placeholder="Ketik detail spesifik di sini..."
            className="w-full p-4 border border-zinc-200 rounded-xl bg-white text-zinc-900 font-sans text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none h-24 transition-all shadow-inner"
          />
        </div>
      )}
    </div>
  );
}
