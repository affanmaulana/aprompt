import { RotateCcw, Search, ChevronDown, ChevronUp, X, Building2, Camera, Sun, Users, Sparkles } from "lucide-react";
import { carriageGroups } from "../data/schema";
import CarriageInput from "./CarriageInput";

const iconMap = {
  Building2: Building2,
  Camera: Camera,
  Sun: Sun,
  Users: Users,
  Sparkles: Sparkles
};

export default function LeftPanel({
  schema,
  selections,
  customTexts,
  onSelectionChange,
  onCustomTextChange,
  onReset,
  activeTab,
  openGroups,
  setOpenGroups,
  collapsedSections,
  setCollapsedSections,
  searchQuery,
  setSearchQuery
}) {

  // Group toggle
  const handleToggleGroup = (groupId) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Individual carriage collapse/expand toggle
  const handleToggleCollapse = (itemId) => {
    // If it's already in collapsedSections as false, it's expanded. Toggling it sets it to true (collapsed).
    // If it's not in collapsedSections (or is true), it is collapsed by default. Toggling it sets it to false (expanded).
    setCollapsedSections((prev) => ({
      ...prev,
      [itemId]: prev[itemId] === false ? true : false
    }));
  };

  // Search filter matching
  const matchesSearch = (item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    
    // Check title
    const titleMatch = item.title?.toLowerCase().includes(query);
    
    // Check options
    const optionsMatch = item.options?.some(
      opt => opt.label?.toLowerCase().includes(query) || opt.value?.toLowerCase().includes(query)
    );
    
    return titleMatch || optionsMatch;
  };

  // Filter carriages
  const filteredSchema = schema.filter(matchesSearch);

  // Reset search
  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      className={`w-full lg:w-[45%] h-full bg-stone-50 border-r border-zinc-200 flex flex-col relative z-10 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 ${
        activeTab === "builder" ? "flex" : "hidden lg:flex"
      }`}
    >
      {/* Premium Header */}
      <div className="px-8 py-6 lg:px-10 lg:py-8 border-b border-zinc-200/60 flex-shrink-0 bg-stone-50/90 backdrop-blur-md sticky top-0 z-20">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-extrabold tracking-tighter text-zinc-900 leading-none">
              APROMPT
            </h1>
            <p className="text-xs font-sans text-zinc-400 mt-2 font-bold tracking-wider uppercase">
              Architectural Prompt Intelligence OS
            </p>
          </div>
        </div>

        {/* Sleek Search Filter */}
        <div className="mt-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search architectural carriages, styles, settings..."
            className="w-full pl-10 pr-10 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-sans text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-black cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Accordion List Container */}
      <div className="flex-1 overflow-y-auto px-8 py-6 lg:px-10 scroll-smooth">
        {carriageGroups
          .sort((a, b) => a.order - b.order)
          .map((group) => {
            // Find carriages belonging to this group
            const groupCarriages = filteredSchema.filter((c) => c.group === group.id);
            
            // Skip group if search returns nothing in this group
            if (groupCarriages.length === 0) return null;

            // Auto-expand group if there is a search query and it matches carriages inside
            const hasMatches = searchQuery.trim().length > 0;
            const isOpen = hasMatches ? true : !!openGroups[group.id];
            
            const GroupIcon = iconMap[group.icon] || Building2;

            return (
              <div
                key={group.id}
                className="mb-4 last:mb-0 border border-zinc-200/60 rounded-2xl bg-white overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => !hasMatches && handleToggleGroup(group.id)}
                  disabled={hasMatches} // Disable toggle when searching (force expand)
                  className={`w-full px-6 py-4.5 flex justify-between items-center text-left transition-all hover:bg-zinc-50/50 cursor-pointer ${
                    isOpen ? "border-b border-zinc-100 bg-zinc-50/10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isOpen ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'} transition-all`}>
                      <GroupIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-sm font-display font-bold text-zinc-950 tracking-wide">
                        {group.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-sans block mt-0.5 font-medium">
                        {groupCarriages.length} {groupCarriages.length === 1 ? 'carriage' : 'carriages'} active
                      </span>
                    </div>
                  </div>
                  {!hasMatches && (
                    <div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  )}
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="p-6 bg-stone-50/30 animate-in fade-in slide-in-from-top-1 duration-200">
                    {groupCarriages
                      .sort((a, b) => a.order - b.order)
                      .map((item) => {
                        // Collapse logic: if a value is selected, collapse by default unless user expanded it
                        const isCollapsed =
                          !!selections[item.id] &&
                          collapsedSections[item.id] !== false;

                        return (
                          <CarriageInput
                            key={item.id}
                            item={item}
                            selectedValue={selections[item.id]}
                            customText={customTexts[item.id]}
                            onChange={onSelectionChange}
                            onCustomTextChange={onCustomTextChange}
                            isCollapsed={isCollapsed}
                            onToggleCollapse={() => handleToggleCollapse(item.id)}
                          />
                        );
                      })}
                  </div>
                )}
              </div>
            );
          })}

        {/* Safe padding spacing for the floating mobile tab navigator */}
        <div className="h-24 lg:h-8"></div>
      </div>

      {/* Footer Reset Actions */}
      <div className="p-6 lg:px-10 lg:py-6 border-t border-zinc-200/60 flex-shrink-0 bg-stone-50">
        <button
          onClick={onReset}
          className="flex items-center justify-center w-full py-3.5 px-4 rounded-xl text-sm font-sans font-bold text-zinc-500 bg-white hover:bg-zinc-100 hover:text-zinc-900 transition-all border border-zinc-200 hover:border-zinc-300 focus:ring-2 focus:ring-zinc-200 focus:outline-none cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Configuration
        </button>
      </div>
    </div>
  );
}
