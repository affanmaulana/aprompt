import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { promptSchema } from "./data/schema";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { useLanguage } from "./context/LanguageContext";

function App() {
  const [selections, setSelections] = useLocalStorage("aprompt_selections", {});
  const [customTexts, setCustomTexts] = useLocalStorage("aprompt_customTexts", {});
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview
  const { t } = useLanguage();

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
      
      // 2. Handle Multi-Select Array Toggle (e.g. material, vehicle, etc.)
      const schemaItem = promptSchema.find(s => s.id === carriageId);
      const isMultiSelect = schemaItem && schemaItem.type === 'multi-select';
      
      if (isMultiSelect) {
        const currentArray = Array.isArray(prevVal) ? prevVal : [];
        
        // Premium multi-select mutual exclusivity for vehicle 'no_vehicles'
        if (carriageId === 'vehicle') {
          if (optionId === 'no_vehicles') {
            // Selecting "No Vehicles" removes all other vehicles and custom details
            if (currentArray.includes('no_vehicles')) {
              return {
                ...prev,
                [carriageId]: []
              };
            } else {
              setCustomTexts((prevCustom) => ({ ...prevCustom, vehicle: "" }));
              let nextSelections = { ...prev, [carriageId]: ['no_vehicles'] };
              if (prev.motion === 'vehicle_motion_trail') {
                delete nextSelections.motion;
              }
              return nextSelections;
            }
          } else {
            // Selecting any other vehicle removes "No Vehicles"
            const filtered = currentArray.filter(id => id !== 'no_vehicles');
            if (filtered.includes(optionId)) {
              return {
                ...prev,
                [carriageId]: filtered.filter(id => id !== optionId)
              };
            } else {
              return {
                ...prev,
                [carriageId]: [...filtered, optionId]
              };
            }
          }
        }
        
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
      
      let nextSelections = {
        ...prev,
        [carriageId]: optionId,
      };

      // Clash Prevention logic for single-selects
      if (carriageId === 'human_presence' && optionId === 'no_humans') {
        // Clear human activities and custom details
        delete nextSelections.human_activity;
        setCustomTexts((prevCustom) => ({ ...prevCustom, human_activity: "" }));
        // Clear human-related motions
        if (prev.motion === 'selective_motion_blur_on_figures' || prev.motion === 'crowd_motion_blur') {
          delete nextSelections.motion;
        }
      }
      
      return nextSelections;
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

  const handleRandomize = () => {
    const newSelections = {};
    const newCustomTexts = {};

    // 1. Decide human presence randomly to handle activities and motion clashes safely
    const humanPresenceItem = promptSchema.find(s => s.id === "human_presence");
    let chosenHumanPresence = null;
    if (humanPresenceItem) {
      const stdOptions = humanPresenceItem.options || [];
      if (stdOptions.length > 0) {
        const randOpt = stdOptions[Math.floor(Math.random() * stdOptions.length)];
        chosenHumanPresence = randOpt.id;
        newSelections["human_presence"] = chosenHumanPresence;
      }
    }

    // 2. Decide vehicle presence randomly to handle motion clashes safely
    const vehicleItem = promptSchema.find(s => s.id === "vehicle");
    let isNoVehicles = false;
    if (vehicleItem) {
      const stdOptions = vehicleItem.options || [];
      if (stdOptions.length > 0) {
        const randVal = Math.random();
        if (randVal < 0.25) {
          newSelections["vehicle"] = ["no_vehicles"];
          isNoVehicles = true;
        } else {
          // Select 1 to 2 random vehicles (excluding no_vehicles and custom)
          const filteredOptions = stdOptions.filter(o => o.id !== "no_vehicles" && o.id !== "custom");
          const shuffled = [...filteredOptions].sort(() => 0.5 - Math.random());
          const count = Math.random() < 0.7 ? 1 : 2;
          const chosen = shuffled.slice(0, count).map(o => o.id);
          newSelections["vehicle"] = chosen;
        }
      }
    }

    // 3. Randomize other carriage options in the schema
    promptSchema.forEach((item) => {
      if (item.id === "human_presence" || item.id === "vehicle") return;

      // Handle clash prevention for human_activity
      if (item.id === "human_activity" && chosenHumanPresence === "no_humans") {
        return;
      }

      // Handle clash prevention for motion blurring options
      if (item.id === "motion") {
        const stdOptions = item.options || [];
        let allowedOptions = [...stdOptions];
        if (chosenHumanPresence === "no_humans") {
          allowedOptions = allowedOptions.filter(o => o.id !== "selective_motion_blur_on_figures" && o.id !== "crowd_motion_blur");
        }
        if (isNoVehicles) {
          allowedOptions = allowedOptions.filter(o => o.id !== "vehicle_motion_trail");
        }
        allowedOptions = allowedOptions.filter(o => o.id !== "custom");

        if (allowedOptions.length > 0) {
          const randOpt = allowedOptions[Math.floor(Math.random() * allowedOptions.length)];
          newSelections["motion"] = randOpt.id;
        }
        return;
      }

      // Standard multi-select items
      const stdOptions = item.options || [];
      if (stdOptions.length === 0) return;

      if (item.type === "multi-select") {
        const filteredOptions = stdOptions.filter(o => o.id !== "custom");
        const shuffled = [...filteredOptions].sort(() => 0.5 - Math.random());
        const randVal = Math.random();
        let count = 1;
        if (randVal < 0.15) count = 0;
        else if (randVal > 0.75) count = 2;

        if (count > 0) {
          newSelections[item.id] = shuffled.slice(0, count).map(o => o.id);
        }
      } else {
        // Single select (excluding custom option for pristine prompts)
        const filteredOptions = stdOptions.filter(o => o.id !== "custom");
        if (filteredOptions.length > 0) {
          const randOpt = filteredOptions[Math.floor(Math.random() * filteredOptions.length)];
          newSelections[item.id] = randOpt.id;
        }
      }
    });

    setSelections(newSelections);
    setCustomTexts(newCustomTexts);
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
        onRandomize={handleRandomize}
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
          {t("tabs.builder", "Builder")}
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-2.5 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 ${
            activeTab === "preview"
              ? "bg-black text-white shadow-md"
              : "text-zinc-400 hover:text-zinc-700"
          }`}
        >
          {t("tabs.preview", "Preview")}
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
