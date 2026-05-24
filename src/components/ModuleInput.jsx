import { useLanguage } from "../context/LanguageContext";

export default function ModuleInput({
  item,
  selectedValue,
  customText,
  onChange,
  onCustomTextChange,
  index,
  disabled = false,
  disabledOptions = []
}) {
  const { t } = useLanguage();
  const formattedIndex = index !== undefined ? `${String(index).padStart(2, '0')} / ` : '';

  // Get premium, communicative placeholder text based on module ID and context
  const getPlaceholderText = () => {
    if (item.id === 'material') {
      return t('placeholder.material', "Add specific materials or custom textures (e.g., micro-cement, warm teakwood, brushed steel)...");
    }
    if (item.id === 'subject') {
      return t('placeholder.subject', "Describe your subject in more detail (e.g., a two-story modern house with large glass windows)...");
    }
    if (item.id === 'arch_style') {
      return t('placeholder.arch_style', "Elaborate on the architectural style (e.g., Minimalist Japandi blend with organic curves)...");
    }
    if (item.id === 'composition') {
      return t('placeholder.composition', "Add custom composition keywords (e.g., golden ratio, rule of thirds, dramatic asymmetry)...");
    }
    if (item.id === 'vehicle') {
      return t('placeholder.vehicle', "Add custom vehicles or transportation details (e.g., vintage bicycle, sleek dark sports car)...");
    }
    if (item.id === 'human_activity') {
      return t('placeholder.human_activity', "Add specific actions or human activities (e.g., reading a book under a tree, drinking coffee)...");
    }
    if (item.allowDetailInput) {
      const translatedTitle = t('param.' + item.id, item.title).toLowerCase();
      const defaultText = `Add custom details for ${item.title.toLowerCase()} (e.g., specify angles, lighting accents, or specific placements)...`;
      return t('placeholder.allowDetail', defaultText).replace('[NAME]', translatedTitle);
    }
    return t('placeholder.default', "Describe your custom preference here in detail...");
  };

  const inputClassName = "w-full mt-4 px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50/30 text-xs font-sans text-zinc-800 placeholder-zinc-400 hover:bg-zinc-50/70 hover:border-zinc-350 focus:bg-white focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 focus:outline-none transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.01)] disabled:opacity-50 disabled:bg-zinc-100 disabled:cursor-not-allowed";

  // 1. Render Materiality Multi-Select
  if (item.type === 'multi-select') {
    const selectedIds = Array.isArray(selectedValue) ? selectedValue : [];
    return (
      <div className={`py-4 transition-all duration-300 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
        <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
          <span className="text-zinc-500 font-extrabold">{formattedIndex}</span>
          {t('param.' + item.id, item.title)}
          {disabled && (
            <span className="text-[9px] font-sans font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded ml-2 normal-case tracking-normal">
              {t('message.disabled_no_humans', 'Disabled (No Humans active)')}
            </span>
          )}
        </span>
        <div className="flex flex-wrap gap-3">
          {item.options?.map((option) => {
            const isSelected = selectedIds.includes(option.id);
            const isOptDisabled = disabledOptions.includes(option.id);
            return (
              <button
                key={option.id}
                disabled={isOptDisabled || disabled}
                onClick={() => !isOptDisabled && onChange(item.id, option.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-150 cursor-pointer border ${
                  isOptDisabled
                    ? "bg-zinc-50 text-zinc-300 border-zinc-150 opacity-30 cursor-not-allowed pointer-events-none"
                    : isSelected
                      ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                      : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-450 hover:text-zinc-800"
                }`}
              >
                {t('option.' + option.id, option.label)}
              </button>
            );
          })}
        </div>
        <input
          type="text"
          value={customText || ""}
          disabled={disabled}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder={getPlaceholderText()}
          className={inputClassName}
        />
      </div>
    );
  }

  // 2. Render Standard Single-Select (with allowDetailInput support)
  return (
    <div className={`py-4 transition-all duration-300 ${disabled ? "opacity-40 pointer-events-none select-none" : ""}`}>
      <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-zinc-400 block mb-3">
        <span className="text-zinc-500 font-extrabold">{formattedIndex}</span>
        {t('param.' + item.id, item.title)}
        {disabled && (
          <span className="text-[9px] font-sans font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded ml-2 normal-case tracking-normal">
            {t('message.disabled_no_humans', 'Disabled (No Humans active)')}
          </span>
        )}
      </span>
      <div className="flex flex-wrap gap-3">
        {item.options?.map((option) => {
          const isSelected = selectedValue === option.id;
          const isOptDisabled = disabledOptions.includes(option.id);
          return (
            <button
              key={option.id}
              disabled={isOptDisabled || disabled}
              onClick={() => !isOptDisabled && onChange(item.id, option.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-sans font-medium transition-all duration-150 cursor-pointer border ${
                isOptDisabled
                  ? "bg-zinc-50 text-zinc-300 border-zinc-150 opacity-30 cursor-not-allowed pointer-events-none"
                  : isSelected
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                    : "bg-white text-zinc-500 border-zinc-200 hover:border-zinc-450 hover:text-zinc-800"
              }`}
            >
              {t('option.' + option.id, option.label)}
            </button>
          );
        })}
      </div>
      
      {item.allowDetailInput && (
        <input
          type="text"
          value={customText || ""}
          disabled={disabled}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder={getPlaceholderText()}
          className={inputClassName}
        />
      )}

      {!item.allowDetailInput && selectedValue === "custom" && (
        <input
          type="text"
          value={customText || ""}
          disabled={disabled}
          onChange={(e) => onCustomTextChange(item.id, e.target.value)}
          placeholder={getPlaceholderText()}
          className={`${inputClassName} animate-in fade-in duration-150`}
        />
      )}
    </div>
  );
}
