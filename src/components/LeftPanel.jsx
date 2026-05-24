import { useState, useEffect } from "react";
import { RotateCcw, Sparkles, Building2, Camera, Sun, Users } from "lucide-react";
import { carriageGroups } from "../data/schema";
import ModuleInput from "./ModuleInput";

const iconMap = {
  Sparkles: Sparkles,
  Building2: Building2,
  Camera: Camera,
  Sun: Sun,
  Users: Users
};

// sophisticated HSL off-white color mapping for sections
const themeMap = {
  essentials: {
    bg: "bg-[#FAF9F6]", // linen
    border: "border-[#EAE6DF]",
    textAccent: "text-[#7A6A53]",
    bulletColor: "bg-[#7A6A53]"
  },
  project: {
    bg: "bg-[#F5F7F5]", // sage
    border: "border-[#E4EAE4]",
    textAccent: "text-[#4A5D4A]",
    bulletColor: "bg-[#4A5D4A]"
  },
  camera: {
    bg: "bg-[#F3F5F8]", // slate ice
    border: "border-[#E2E6EC]",
    textAccent: "text-[#3D5266]",
    bulletColor: "bg-[#3D5266]"
  },
  environment: {
    bg: "bg-[#FCF9F3]", // golden hour
    border: "border-[#EFE7D8]",
    textAccent: "text-[#8E7146]",
    bulletColor: "bg-[#8E7146]"
  },
  narrative: {
    bg: "bg-[#F6F5FA]", // lavender mauve
    border: "border-[#EAE7F2]",
    textAccent: "text-[#58496D]",
    bulletColor: "bg-[#58496D]"
  }
};

export default function LeftPanel({
  schema,
  selections,
  customTexts,
  onSelectionChange,
  onCustomTextChange,
  onReset,
  activeTab
}) {
  const [activeSection, setActiveSection] = useState("essentials");

  // Track active section on scroll using IntersectionObserver
  useEffect(() => {
    const scrollContainer = document.getElementById("specifications-scroll-container");
    if (!scrollContainer) return;

    const observerOptions = {
      root: scrollContainer,
      rootMargin: "-10% 0px -75% 0px", // Detect when section is active near top
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const groupId = entry.target.id.replace("section-", "");
          setActiveSection(groupId);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    carriageGroups.forEach((group) => {
      const el = document.getElementById(`section-${group.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [schema, activeTab]);

  // Smooth scroll to target anchor
  const handleScrollToSection = (groupId) => {
    const el = document.getElementById(`section-${groupId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(groupId);
    }
  };

  return (
    <div
      className={`w-full lg:w-[45%] h-full bg-stone-50 border-r border-zinc-200 flex flex-col relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.04)] transition-all duration-300 ${
        activeTab === "builder" ? "flex" : "hidden lg:flex"
      }`}
    >
      <div className="flex-1 flex flex-row overflow-hidden">
        
        {/* ==================================================================
            LEFT COLUMN: 30% Index Sidebar Navigation
            ================================================================== */}
        <div className="w-[32%] border-r border-zinc-150 py-8 pl-8 pr-3 flex flex-col justify-between flex-shrink-0 bg-stone-50/70 select-none">
          <div>
            <div className="mb-10">
              <h1 className="text-2xl font-display font-extrabold tracking-tighter text-zinc-900 leading-none">
                APROMPT
              </h1>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-zinc-400 block mt-2">
                STUDIO OS
              </span>
            </div>

            {/* Sidebar Anchor Links */}
            <nav className="flex flex-col gap-6 pl-2 relative">
              {carriageGroups
                .sort((a, b) => a.order - b.order)
                .map((group) => {
                  const isActive = activeSection === group.id;
                  const theme = themeMap[group.id] || themeMap.essentials;
                  const GroupIcon = iconMap[group.icon] || Sparkles;
                  return (
                    <button
                      key={group.id}
                      onClick={() => handleScrollToSection(group.id)}
                      className={`flex items-center gap-2.5 text-left transition-all duration-200 group/nav relative cursor-pointer ${
                        isActive
                          ? "text-zinc-950 font-bold translate-x-1.5"
                          : "text-zinc-400 hover:text-zinc-700 font-medium"
                      }`}
                    >
                      {/* Active Indicator Bullet mapped to HSL group theme */}
                      {isActive && (
                        <span className={`absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${theme.bulletColor} animate-pulse`} />
                      )}
                      <GroupIcon className={`w-3.5 h-3.5 transition-all ${
                        isActive ? theme.textAccent : "text-zinc-350 group-hover/nav:text-zinc-550"
                      }`} />
                      <span className="text-xs font-sans tracking-wide">
                        {group.title}
                      </span>
                    </button>
                  );
                })}
            </nav>
          </div>

          {/* Quick reset inside left sub-column bottom */}
          <div>
            <button
              onClick={onReset}
              title="Reset configuration"
              className="flex items-center justify-center p-3 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-350 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: 70% Scrollable Content Area (HSL group backdrops)
            ================================================================== */}
        <div
          id="specifications-scroll-container"
          className="w-[68%] h-full overflow-y-auto px-6 py-8 flex flex-col scroll-smooth bg-white"
        >
          {carriageGroups
            .sort((a, b) => a.order - b.order)
            .map((group) => {
              const groupCarriages = schema.filter((c) => c.group === group.id);
              if (groupCarriages.length === 0) return null;

              const theme = themeMap[group.id] || themeMap.essentials;

              return (
                <div
                  key={group.id}
                  id={`section-${group.id}`}
                  className={`mb-8 p-6 rounded-2xl border ${theme.bg} ${theme.border} transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.015)]`}
                >
                  {/* Elegant Section Title */}
                  <div className="mb-4 flex items-center justify-between border-b border-zinc-200/50 pb-2">
                    <h2 className={`text-xs font-display font-extrabold ${theme.textAccent} tracking-widest uppercase`}>
                      {group.title}
                    </h2>
                    <span className="text-[9px] font-sans font-bold text-zinc-400 bg-white/60 py-0.5 px-2 rounded-full border border-zinc-150">
                      {groupCarriages.length} params
                    </span>
                  </div>

                  {/* Render modules within group */}
                  <div className="flex flex-col">
                    {groupCarriages
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        // Calculate global sequential index for clean numerical indexing
                        const globalIndex = schema.findIndex(s => s.id === item.id) + 1;
                        return (
                          <ModuleInput
                            key={item.id}
                            item={item}
                            selectedValue={selections[item.id]}
                            customText={customTexts[item.id]}
                            onChange={onSelectionChange}
                            onCustomTextChange={onCustomTextChange}
                            index={globalIndex}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}

          {/* Spacer for bottom scrolling freedom */}
          <div className="h-48 flex-shrink-0" />
        </div>

      </div>
    </div>
  );
}
