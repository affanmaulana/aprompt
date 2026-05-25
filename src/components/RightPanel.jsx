import { useState } from "react";
import { Copy, Check, Shuffle, RotateCcw } from "lucide-react";
import { assemblePrompt } from "../engine/promptEngine";
import { promptSentenceConfig } from "../data/schema";
import { useLanguage } from "../context/LanguageContext";
import { track } from "@vercel/analytics";

export default function RightPanel({
  schema,
  selections,
  customTexts,
  activeTab,
  activeCategory,
  onReset,
  onRandomize
}) {
  const { language, setLanguage, t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const generatedPrompt = assemblePrompt(schema, selections, customTexts, promptSentenceConfig, activeCategory);

  const handleCopy = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);

      // Trigger Vercel Analytics event and flag tracking
      track('Copy Prompt', {
        category: activeCategory,
        promptLength: generatedPrompt.length
      }, {
        flags: ['category-driven-v3']
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const rightPanelBg = activeCategory === 'interior'
    ? 'bg-[#FBF9F5]'
    : activeCategory === 'cityscape'
      ? 'bg-[#F5F7FA]'
      : 'bg-[#FCFDFB]';

  return (
    <div
      className={`w-full lg:w-[55%] h-full ${rightPanelBg} flex flex-col relative transition-all duration-300 border-l border-zinc-200/50 ${activeTab === "preview" ? "flex" : "hidden lg:flex"
        }`}
    >
      {/* ==================================================================
          MOBILE-ONLY HEADER BAR (Visual Coherence & Panel Branding)
          ================================================================== */}
      <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-transparent border-b border-zinc-200/60 select-none z-20">
        <div>
          <h1 className="text-xl font-display font-extrabold tracking-tighter text-zinc-900 leading-none">
            APROMPT
          </h1>
          <span className="text-[8px] font-sans font-bold uppercase tracking-widest text-zinc-400 block mt-1">
            {t('brand.sub', 'ARCHITECTURAL')}
          </span>
        </div>
        <div className="text-[9px] font-sans font-bold tracking-wider text-zinc-400 border border-zinc-200/80 bg-zinc-50/50 px-3 py-1.5 rounded-full uppercase">
          {t('tabs.preview', 'Preview')}
        </div>
      </div>

      {/* Scrollable Prompt Viewport */}
      <div className="flex-1 px-8 py-12 lg:px-16 lg:py-20 overflow-y-auto flex flex-col max-w-4xl mx-auto w-full pb-36">
        <div className="my-auto w-full flex flex-col">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 select-none flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {t('output.title', 'Final Generated Output')}
          </h2>

          <div className="min-h-[200px] lg:min-h-[250px] mb-8">
            {generatedPrompt ? (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.35] text-zinc-900 tracking-tight transition-all duration-300 selection:bg-accent selection:text-white">
                {generatedPrompt}
              </p>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.35] text-zinc-300 tracking-tight transition-all duration-300 select-none">
                {t('output.empty', 'Your highly detailed architectural prompt will materialize here.')}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ==================================================================
          MOBILE-ONLY STICKY COPY CONTROL (Positioned perfectly above tab switcher)
          ================================================================== */}
      {generatedPrompt && (
        <div className={`lg:hidden fixed bottom-[90px] left-0 right-0 px-6 py-4 z-40 bg-gradient-to-t ${
          activeCategory === 'interior'
            ? 'from-[#FBF9F5] via-[#FBF9F5]/90'
            : activeCategory === 'cityscape'
              ? 'from-[#F5F7FA] via-[#F5F7FA]/90'
              : 'from-[#FCFDFB] via-[#FCFDFB]/90'
        } to-transparent pointer-events-none`}>
          <button
            onClick={handleCopy}
            className={`pointer-events-auto flex items-center justify-center w-full py-4 rounded-xl text-sm font-sans font-bold transition-all duration-300 cursor-pointer shadow-xl active:scale-95 ${
              copied
                ? "bg-accent text-white shadow-2xl shadow-accent/20 scale-[0.98]"
                : "bg-black text-white hover:bg-zinc-800"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-3" />
                {t('action.copied', 'Copied to Clipboard')}
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-3" />
                {t('action.copy', 'Copy Prompt')}
              </>
            )}
          </button>
        </div>
      )}

      {/* ==================================================================
          DESKTOP-ONLY STICKY COMMAND CENTER (Command bar opposite layout)
          ================================================================== */}
      <div className={`hidden lg:flex absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t ${
        activeCategory === 'interior'
          ? 'from-[#FBF9F5] via-[#FBF9F5]/95'
          : activeCategory === 'cityscape'
            ? 'from-[#F5F7FA] via-[#F5F7FA]/95'
            : 'from-[#FCFDFB] via-[#FCFDFB]/95'
      } to-transparent justify-center z-20 pointer-events-none select-none`}>
        <div className="max-w-4xl w-full mx-auto flex items-center justify-between pointer-events-auto">
          {/* Bottom Left Toolbar/Utility Area */}
          <div className="flex items-center gap-3">
            {/* Randomize Button */}
            <button
              onClick={onRandomize}
              className="flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-accent text-white font-sans font-bold text-xs hover:bg-accent/90 hover:shadow-md active:scale-95 transition-all duration-200 cursor-pointer shadow-sm select-none w-[130px]"
            >
              <Shuffle className="w-3.5 h-3.5" />
              {t('action.randomize', 'Randomize')}
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              title={t('action.reset', 'Reset configuration')}
              className="flex items-center justify-center p-3 rounded-xl border border-zinc-200 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 hover:border-zinc-300 active:scale-95 transition-all duration-200 cursor-pointer shadow-sm bg-white"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-zinc-200/50 p-0.5 h-10 rounded-xl shadow-inner select-none">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3.5 h-full rounded-lg text-[10px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                  language === "en"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage("id")}
                className={`px-3.5 h-full rounded-lg text-[10px] font-sans font-extrabold tracking-wider transition-all duration-200 cursor-pointer ${
                  language === "id"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-600"
                }`}
              >
                ID
              </button>
            </div>
          </div>

          {/* Copy Prompt Button */}
          <button
            onClick={handleCopy}
            disabled={!generatedPrompt}
            className={`flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-sans font-bold transition-all duration-300 cursor-pointer shadow-lg ${!generatedPrompt
              ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
              : copied
                ? "bg-accent text-white shadow-xl shadow-accent/20 scale-[0.98]"
                : "bg-black text-white hover:bg-zinc-800 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-0.5 active:scale-95"
              }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-3" />
                {t('action.copied', 'Copied to Clipboard')}
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-3" />
                {t('action.copy', 'Copy Prompt')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
