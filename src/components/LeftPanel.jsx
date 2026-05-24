import CarriageInput from "./CarriageInput";
import { RotateCcw } from "lucide-react";

export default function LeftPanel({
  schema,
  selections,
  customTexts,
  onSelectionChange,
  onCustomTextChange,
  onReset,
  activeTab
}) {
  return (
    <div
      className={`w-full lg:w-[45%] h-full bg-stone-50 border-r border-zinc-200 flex flex-col relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 ${
        activeTab === "builder" ? "flex" : "hidden lg:flex"
      }`}
    >
      <div className="px-8 py-8 lg:px-12 lg:py-10 border-b border-zinc-200/60 flex-shrink-0 bg-stone-50/80 backdrop-blur-md sticky top-0 z-20">
        <h1 className="text-3xl font-display font-extrabold tracking-tighter text-zinc-900">APROMPT</h1>
        <p className="text-sm font-sans text-zinc-500 mt-1.5 font-medium tracking-wide">Premium Architectural Generator</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-8 py-10 lg:px-12 scroll-smooth">
        {schema.map((item) => (
          <CarriageInput
            key={item.id}
            item={item}
            selectedValue={selections[item.id]}
            customText={customTexts[item.id]}
            onChange={onSelectionChange}
            onCustomTextChange={onCustomTextChange}
          />
        ))}
        {/* Safe padding spacing for the floating mobile tab navigator */}
        <div className="h-24 lg:h-8"></div>
      </div>
      
      <div className="p-6 lg:px-12 lg:py-6 border-t border-zinc-200/60 flex-shrink-0 bg-stone-50">
        <button
          onClick={onReset}
          className="flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-sans font-semibold text-zinc-500 bg-white hover:bg-zinc-100 hover:text-zinc-900 transition-all border border-zinc-200 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-200 focus:outline-none"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Configuration
        </button>
      </div>
    </div>
  );
}
