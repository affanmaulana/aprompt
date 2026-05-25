import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { promptSchema } from "./data/schema";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";
import { useLanguage } from "./context/LanguageContext";

// Pure random utility helpers defined outside the component to satisfy React 19 linter rules
function selectRandomOption(options) {
  if (!options || options.length === 0) return null;
  return options[Math.floor(Math.random() * options.length)];
}

function getRandomValue() {
  return Math.random();
}

function getShuffledOptions(options) {
  return [...options].sort(() => 0.5 - Math.random());
}

function App() {
  const [activeCategory, setActiveCategory] = useLocalStorage("aprompt_category", "exterior");
  const [selections, setSelections] = useLocalStorage("aprompt_selections", {});
  const [customTexts, setCustomTexts] = useLocalStorage("aprompt_customTexts", {});
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview
  const { t } = useLanguage();

  // Filter schema dynamically based on selected render category
  const activeSchema = promptSchema.filter(item => !item.categories || item.categories.includes(activeCategory));

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
    const newSelections = { ...selections };
    const newCustomTexts = { ...customTexts };

    // Clear selections and custom text only for active carriages to keep others intact
    activeSchema.forEach(item => {
      delete newSelections[item.id];
      delete newCustomTexts[item.id];
    });

    // 1. Decide human presence randomly to handle activities and motion clashes safely
    const humanPresenceItem = activeSchema.find(s => s.id === "human_presence");
    let chosenHumanPresence = null;
    if (humanPresenceItem) {
      const stdOptions = humanPresenceItem.options || [];
      if (stdOptions.length > 0) {
        const randOpt = selectRandomOption(stdOptions);
        chosenHumanPresence = randOpt ? randOpt.id : null;
        if (chosenHumanPresence) {
          newSelections["human_presence"] = chosenHumanPresence;
        }
      }
    }

    // 2. Decide vehicle presence randomly to handle motion clashes safely
    const vehicleItem = activeSchema.find(s => s.id === "vehicle");
    let isNoVehicles = false;
    if (vehicleItem) {
      const stdOptions = vehicleItem.options || [];
      if (stdOptions.length > 0) {
        const randVal = getRandomValue();
        if (randVal < 0.25) {
          newSelections["vehicle"] = ["no_vehicles"];
          isNoVehicles = true;
        } else {
          // Select 1 to 2 random vehicles (excluding no_vehicles and custom)
          const filteredOptions = stdOptions.filter(o => o.id !== "no_vehicles" && o.id !== "custom");
          const shuffled = getShuffledOptions(filteredOptions);
          const count = getRandomValue() < 0.7 ? 1 : 2;
          const chosen = shuffled.slice(0, count).map(o => o.id);
          newSelections["vehicle"] = chosen;
        }
      }
    }

    // 3. Randomize other carriage options in the active schema
    activeSchema.forEach((item) => {
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

        const randOpt = selectRandomOption(allowedOptions);
        if (randOpt) {
          newSelections["motion"] = randOpt.id;
        }
        return;
      }

      // Standard options randomization
      const stdOptions = item.options || [];
      if (stdOptions.length === 0) return;

      if (item.type === "multi-select") {
        const filteredOptions = stdOptions.filter(o => o.id !== "custom");
        const shuffled = getShuffledOptions(filteredOptions);
        const randVal = getRandomValue();
        let count = 1;
        if (randVal < 0.15) count = 0;
        else if (randVal > 0.75) count = 2;

        if (count > 0) {
          newSelections[item.id] = shuffled.slice(0, count).map(o => o.id);
        }
      } else {
        // Single select (excluding custom option for pristine prompts)
        const filteredOptions = stdOptions.filter(o => o.id !== "custom");
        const randOpt = selectRandomOption(filteredOptions);
        if (randOpt) {
          newSelections[item.id] = randOpt.id;
        }
      }
    });

    setSelections(newSelections);
    setCustomTexts(newCustomTexts);
  };

  // Check if user has made any selections or entered custom text in visible active carriages
  const hasSelections = Object.keys(selections).some(
    (key) => {
      // Only consider keys that are visible in active category
      if (!activeSchema.some(s => s.id === key)) return false;
      const val = selections[key];
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'boolean') return val === true;
      return val && (val !== "custom" || (customTexts[key] && customTexts[key].trim()));
    }
  );

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-white overflow-hidden font-sans antialiased selection:bg-zinc-200 selection:text-zinc-900 relative">
      <LeftPanel
        schema={activeSchema}
        selections={selections}
        customTexts={customTexts}
        onSelectionChange={handleSelectionChange}
        onCustomTextChange={handleCustomTextChange}
        onReset={handleReset}
        onRandomize={handleRandomize}
        activeTab={activeTab}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <RightPanel
        schema={activeSchema}
        selections={selections}
        customTexts={customTexts}
        activeTab={activeTab}
        activeCategory={activeCategory}
        onReset={handleReset}
        onRandomize={handleRandomize}
      />

      {/* Floating Segmented Control for Mobile Viewport */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md border border-zinc-200/80 p-1 rounded-full shadow-2xl flex w-[85%] max-w-[280px] h-[48px] relative transition-all duration-300 select-none">
        {/* Sliding Active Pill */}
        <div
          className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-black rounded-full transition-all duration-300 ease-out z-0 ${
            activeTab === "preview" ? "left-[50%]" : "left-1"
          }`}
        />

        <button
          onClick={() => setActiveTab("builder")}
          className={`flex-1 h-full flex items-center justify-center rounded-full text-xs font-display font-bold tracking-wider uppercase transition-colors duration-300 z-10 cursor-pointer ${
            activeTab === "builder" ? "text-white" : "text-zinc-400"
          }`}
        >
          {t("tabs.builder", "Builder")}
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 h-full flex items-center justify-center gap-2 rounded-full text-xs font-display font-bold tracking-wider uppercase transition-colors duration-300 z-10 cursor-pointer ${
            activeTab === "preview" ? "text-white" : "text-zinc-400"
          }`}
        >
          {t("tabs.preview", "Preview")}
          {hasSelections && (
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
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
