import { useState, useEffect } from "react";
import { RotateCcw, Sparkles, Camera, Sun, Users, Shuffle } from "lucide-react";
import { carriageGroups } from "../data/schema";
import ModuleInput from "./ModuleInput";
import { useLanguage } from "../context/LanguageContext";

const iconMap = {
  Sparkles: Sparkles,
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
  onRandomize,
  activeTab
}) {
  const [activeSection, setActiveSection] = useState("essentials");
  const { language, setLanguage, t } = useLanguage();

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
      className={`w-full lg:w-[45%] h-full bg-stone-50 flex flex-col relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.04)] transition-all duration-300 ${activeTab === "builder" ? "flex" : "hidden lg:flex"
        }`}
    >
      {/* ==================================================================
          MOBILE-ONLY HEADER BAR & UTILITIES (Elegant Space Optimization)
          ================================================================== */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-stone-50 border-b border-zinc-200/60 select-none z-20">
        <div>
          <h1 className="text-xl font-display font-extrabold tracking-tighter text-zinc-900 leading-none">
            APROMPT
          </h1>
          <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-400 block mt-1">
            {t('brand.sub', 'ARCHITECTURAL')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Randomize Button */}
          <button
            onClick={onRandomize}
            title={t('action.randomize', 'Randomize')}
            className="flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-350 active:scale-95 transition-all cursor-pointer shadow-sm bg-white"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            title={t('action.reset', 'Reset configuration')}
            className="flex items-center justify-center p-2.5 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-350 active:scale-95 transition-all cursor-pointer shadow-sm bg-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Language Switcher */}
          <div className="flex items-center bg-zinc-200/50 p-0.5 h-9 rounded-xl shadow-inner select-none">
            <button
              onClick={() => setLanguage("en")}
              className={`px-2.5 h-full rounded-lg text-[9px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                language === "en"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage("id")}
              className={`px-2.5 h-full rounded-lg text-[9px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                language === "id"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-400 hover:text-zinc-650"
              }`}
            >
              ID
            </button>
          </div>
        </div>
      </div>

      {/* ==================================================================
          MOBILE-ONLY HORIZONTAL SECTION TABS (Swipeable Navigation)
          ================================================================== */}
      <div className="lg:hidden sticky top-0 bg-white/95 backdrop-blur-md border-b border-zinc-200/50 z-20 px-6 py-3 flex items-center overflow-x-auto gap-2 scrollbar-none select-none">
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
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0 text-xs font-medium ${
                  isActive
                    ? `${theme.bg} ${theme.textAccent} ${theme.border} font-bold shadow-sm`
                    : "bg-stone-50/50 text-zinc-400 border-transparent hover:text-zinc-600 hover:bg-stone-100"
                }`}
              >
                <GroupIcon className="w-3.5 h-3.5" />
                <span>{t('group.' + group.id, group.title)}</span>
              </button>
            );
          })}
      </div>

      <div className="flex-1 flex flex-row overflow-hidden">

        {/* ==================================================================
            LEFT COLUMN: 30% Index Sidebar Navigation (Borderless Canvas - DESKTOP ONLY)
            ================================================================== */}
        <div className="hidden lg:flex w-[32%] py-8 pl-8 pr-3 flex-col justify-between flex-shrink-0 bg-stone-50/70 select-none">
          <div>
            <div className="mb-10">
              <h1 className="text-2xl font-display font-extrabold tracking-tighter text-zinc-900 leading-none">
                APROMPT
              </h1>
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-zinc-400 block mt-2">
                {t('brand.sub', 'ARCHITECTURAL')}
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
                      className={`flex items-center gap-2.5 text-left transition-all duration-200 group/nav relative cursor-pointer ${isActive
                        ? "text-zinc-950 font-bold translate-x-1.5"
                        : "text-zinc-400 hover:text-zinc-700 font-medium"
                        }`}
                    >
                      {/* Active Indicator Bullet mapped to HSL group theme */}
                      {isActive && (
                        <span className={`absolute -left-3.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${theme.bulletColor} animate-pulse`} />
                      )}
                      <GroupIcon className={`w-3.5 h-3.5 transition-all ${isActive ? theme.textAccent : "text-zinc-350 group-hover/nav:text-zinc-550"
                        }`} />
                      <span className="text-xs font-sans tracking-wide">
                        {t('group.' + group.id, group.title)}
                      </span>
                    </button>
                  );
                })}
            </nav>
          </div>

          {/* Bottom Toolbar/Utility Area */}
          <div className="flex flex-col gap-3">
            {/* Randomize Button */}
            <button
              onClick={onRandomize}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent text-white font-sans font-bold text-xs hover:bg-accent/90 hover:shadow-md transition-all duration-200 cursor-pointer shadow-sm select-none"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {t('action.randomize', 'Randomize')}
            </button>

            {/* Reset and Language Switcher row */}
            <div className="flex items-center gap-3">
              <button
                onClick={onReset}
                title={t('action.reset', 'Reset configuration')}
                className="flex items-center justify-center p-3 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-350 transition-all cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-zinc-200/50 p-0.5 h-10 rounded-xl shadow-inner select-none">
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-3 h-full rounded-lg text-[10px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                    language === "en"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage("id")}
                  className={`px-3 h-full rounded-lg text-[10px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                    language === "id"
                      ? "bg-white text-zinc-950 shadow-sm"
                      : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  ID
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================================================
            RIGHT COLUMN: 70% Scrollable Content Area (Tighter spacing - FULL WIDTH ON MOBILE)
            ================================================================== */}
        <div
          id="specifications-scroll-container"
          className="w-full lg:w-[68%] h-full overflow-y-auto px-6 py-8 flex flex-col scroll-smooth bg-white"
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
                  className={`mb-5 p-6 rounded-2xl border ${theme.bg} ${theme.border} transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.015)]`}
                >
                  {/* Elegant Section Title (No parameter count label) */}
                  <div className="mb-4 flex items-center justify-between border-b border-zinc-200/50 pb-2">
                    <h2 className={`text-xs font-display font-extrabold ${theme.textAccent} tracking-widest uppercase`}>
                      {t('group.' + group.id, group.title)}
                    </h2>
                  </div>

                  {/* Render modules within group */}
                  <div className="flex flex-col">
                    {groupCarriages
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        const globalIndex = schema.findIndex(s => s.id === item.id) + 1;
                        const isDisabled = item.id === 'human_activity' && selections['human_presence'] === 'no_humans';
                        const disabledOptions = item.id === 'motion'
                          ? [
                            ...(selections['human_presence'] === 'no_humans' ? ['selective_motion_blur_on_figures', 'crowd_motion_blur'] : []),
                            ...(Array.isArray(selections['vehicle']) && selections['vehicle'].includes('no_vehicles') ? ['vehicle_motion_trail'] : [])
                          ]
                          : [];
                        return (
                          <ModuleInput
                            key={item.id}
                            item={item}
                            selectedValue={selections[item.id]}
                            customText={customTexts[item.id]}
                            onChange={onSelectionChange}
                            onCustomTextChange={onCustomTextChange}
                            index={globalIndex}
                            disabled={isDisabled}
                            disabledOptions={disabledOptions}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            })}

          {/* Spacer for bottom scrolling freedom */}
          <div className="h-12 flex-shrink-0" />
        </div>

      </div>
    </div>
  );
}
