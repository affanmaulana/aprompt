import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { promptSchema } from "./data/schema";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  const [selections, setSelections] = useLocalStorage("aprompt_selections", {});
  const [customTexts, setCustomTexts] = useLocalStorage("aprompt_customTexts", {});
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview

  // Strict Mount Cleanup: Keep only active keys from the new schema
  useEffect(() => {
    const activeKeys = new Set(promptSchema.map(item => item.id));
    let cleaned = false;

    const newSelections = { ...selections };
    const newCustomTexts = { ...customTexts };

    // Delete keys not present in new schema
    Object.keys(newSelections).forEach(key => {
      if (!activeKeys.has(key)) {
        delete newSelections[key];
        cleaned = true;
      }
    });

    Object.keys(newCustomTexts).forEach(key => {
      if (!activeKeys.has(key)) {
        delete newCustomTexts[key];
        cleaned = true;
      }
    });

    if (cleaned) {
      setSelections(newSelections);
      setCustomTexts(newCustomTexts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectionChange = (carriageId, optionId) => {
    setSelections((prev) => {
      const prevVal = prev[carriageId];
      
      // 1. Handle Geometry Boolean Toggle
      if (carriageId === 'geometry') {
        return {
          ...prev,
          [carriageId]: optionId === true
        };
      }
      
      // 2. Handle Material Multi-Select Array Toggle
      if (carriageId === 'material') {
        const currentArray = Array.isArray(prevVal) ? prevVal : [];
        if (currentArray.includes(optionId)) {
          return {
            ...prev,
            [carriageId]: currentArray.filter(id => id !== optionId)
          };
        } else {
          return {
            ...prev,
            [carriageId]: [...currentArray, optionId]
          };
        }
      }
      
      // 3. Default Single-Select: toggle off if selected again
      if (prevVal === optionId) {
        const nextSelections = { ...prev };
        delete nextSelections[carriageId];
        return nextSelections;
      }
      
      return {
        ...prev,
        [carriageId]: optionId,
      };
    });
  };

  const handleCustomTextChange = (carriageId, text) => {
    setCustomTexts((prev) => ({
      ...prev,
      [carriageId]: text,
    }));
  };

  const handleReset = () => {
    window.localStorage.removeItem("aprompt_selections");
    window.localStorage.removeItem("aprompt_customTexts");
    setSelections({});
    setCustomTexts({});
  };

  // Check if user has made any selections or entered custom text
  const hasSelections = Object.keys(selections).some(
    (key) => {
      const val = selections[key];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'boolean') return val === true;
      return val && (val !== "custom" || (customTexts[key] && customTexts[key].trim()));
    }
  );

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-white overflow-hidden font-sans antialiased selection:bg-zinc-200 selection:text-zinc-900 relative">
      <LeftPanel
        schema={promptSchema}
        selections={selections}
        customTexts={customTexts}
        onSelectionChange={handleSelectionChange}
        onCustomTextChange={handleCustomTextChange}
        onReset={handleReset}
        activeTab={activeTab}
      />
      <RightPanel
        schema={promptSchema}
        selections={selections}
        customTexts={customTexts}
        activeTab={activeTab}
      />

      {/* Floating Segmented Control for Mobile Viewport */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-zinc-200/80 p-1.5 rounded-full shadow-2xl flex items-center gap-1.5 w-[85%] max-w-[280px] transition-all duration-300">
        <button
          onClick={() => setActiveTab("builder")}
          className={`flex-1 py-2.5 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 ${
            activeTab === "builder"
              ? "bg-black text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          Builder
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "preview"
              ? "bg-black text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          Preview
          {hasSelections && (
            <span
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeTab === "preview" ? "bg-white" : "bg-black animate-pulse"
              }`}
            />
          )}
        </button>
      </div>
      <Analytics />
    </div>
  );
}

export default App;
