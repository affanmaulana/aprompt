import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { assemblePrompt } from "../engine/promptEngine";
import { promptSentenceConfig } from "../data/schema";

export default function RightPanel({ schema, selections, customTexts, activeTab }) {
  const [copied, setCopied] = useState(false);
  const generatedPrompt = assemblePrompt(schema, selections, customTexts, promptSentenceConfig);

  const handleCopy = async () => {
    if (!generatedPrompt) return;

    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div
      className={`w-full lg:w-[55%] h-full bg-white flex flex-col relative transition-all duration-300 border-l border-zinc-200/50 ${
        activeTab === "preview" ? "flex" : "hidden lg:flex"
      }`}
    >
      {/* Scrollable Prompt Viewport */}
      <div className="flex-1 px-8 py-12 lg:px-16 lg:py-20 overflow-y-auto flex flex-col max-w-4xl mx-auto w-full pb-36">
        <div className="my-auto w-full flex flex-col">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 select-none">
            Final Generated Output
          </h2>

          <div className="min-h-[200px] lg:min-h-[250px] mb-8">
            {generatedPrompt ? (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.35] text-zinc-900 tracking-tight transition-all duration-300 selection:bg-zinc-800 selection:text-white">
                {generatedPrompt}
              </p>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.35] text-zinc-300 tracking-tight transition-all duration-300 select-none">
                Your highly detailed architectural prompt will materialize here.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar containing the Copy Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10 bg-gradient-to-t from-white via-white/95 to-white/0 flex justify-center z-20 pointer-events-none select-none">
        <div className="max-w-4xl w-full mx-auto flex justify-start pointer-events-auto">
          <button
            onClick={handleCopy}
            disabled={!generatedPrompt}
            className={`flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-sans font-bold transition-all duration-300 cursor-pointer shadow-lg ${
              !generatedPrompt
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                : copied
                ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[0.98]"
                : "bg-black text-white hover:bg-zinc-800 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-0.5"
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 mr-3" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-3" />
                Copy Final Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
