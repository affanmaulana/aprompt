import { useState, useEffect } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { promptSchema } from "./data/schema";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

function App() {
  const [selections, setSelections] = useLocalStorage("aprompt_selections", {});
  const [customTexts, setCustomTexts] = useLocalStorage("aprompt_customTexts", {});
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview

  // Aprompt v2 state persistence
  const [openGroups, setOpenGroups] = useLocalStorage("aprompt_openGroups", { project: true });
  const [collapsedSections, setCollapsedSections] = useLocalStorage("aprompt_collapsedSections", {});
  const [searchQuery, setSearchQuery] = useLocalStorage("aprompt_searchQuery", "");

  // Legacy Data Migration (v1 -> v2)
  useEffect(() => {
    let migrated = false;
    const newSelections = { ...selections };
    const newCustomTexts = { ...customTexts };

    // Migrate 'source' carriage
    if (selections.source) {
      if (selections.source === 'sketchup') {
        newSelections.render_quality = 'custom';
        newCustomTexts.render_quality = 'raw 3D Sketchup clay render';
      } else if (selections.source === 'hand_sketch') {
        newSelections.render_quality = 'custom';
        newCustomTexts.render_quality = 'hand-drawn architectural ink sketch';
      } else if (selections.source === 'custom' && customTexts.source) {
        newSelections.render_quality = 'custom';
        newCustomTexts.render_quality = customTexts.source;
      }
      delete newSelections.source;
      delete newCustomTexts.source;
      migrated = true;
    }

    // Migrate 'environment' carriage
    if (selections.environment) {
      if (selections.environment === 'golden_hour') {
        newSelections.lighting = 'golden_hour';
      } else if (selections.environment === 'overcast') {
        newSelections.lighting = 'overcast_soft_light';
      } else if (selections.environment === 'custom' && customTexts.environment) {
        newSelections.lighting = 'custom';
        newCustomTexts.lighting = customTexts.environment;
      }
      delete newSelections.environment;
      delete newCustomTexts.environment;
      migrated = true;
    }

    if (migrated) {
      setSelections(newSelections);
      setCustomTexts(newCustomTexts);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectionChange = (carriageId, optionId) => {
    setSelections((prev) => ({
      ...prev,
      [carriageId]: optionId,
    }));
  };

  const handleCustomTextChange = (carriageId, text) => {
    setCustomTexts((prev) => ({
      ...prev,
      [carriageId]: text,
    }));
  };

  const handleReset = () => {
    // Clear localStorage and reset state
    window.localStorage.removeItem("aprompt_selections");
    window.localStorage.removeItem("aprompt_customTexts");
    window.localStorage.removeItem("aprompt_openGroups");
    window.localStorage.removeItem("aprompt_collapsedSections");
    window.localStorage.removeItem("aprompt_searchQuery");
    
    setSelections({});
    setCustomTexts({});
    setOpenGroups({ project: true });
    setCollapsedSections({});
    setSearchQuery("");
  };

  // Check if user has made any selections or entered custom text
  const hasSelections = Object.keys(selections).some(
    (key) => selections[key] && (selections[key] !== "custom" || (customTexts[key] && customTexts[key].trim()))
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
        openGroups={openGroups}
        setOpenGroups={setOpenGroups}
        collapsedSections={collapsedSections}
        setCollapsedSections={setCollapsedSections}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
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
    </div>
  );
}

export default App;
