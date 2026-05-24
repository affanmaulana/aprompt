import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { assemblePrompt } from "../engine/promptEngine";
import { promptSentenceConfig } from "../data/schema";

export default function RightPanel({ schema, selections, customTexts, activeTab }) {
  const [copied, setCopied] = useState(false);
  // Derive prompt directly to avoid cascading renders (Lint Rule: react-hooks/set-state-in-effect)
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
      className={`w-full lg:w-[55%] h-full bg-white flex flex-col relative transition-all duration-300 ${
        activeTab === "preview" ? "flex" : "hidden lg:flex"
      }`}
    >
      <div className="flex-1 px-8 py-12 lg:px-16 lg:py-20 overflow-y-auto flex flex-col max-w-4xl mx-auto w-full">
        {/* my-auto container vertically centers content when spacious, but scrolls cleanly on short/overflow viewports */}
        <div className="my-auto w-full flex flex-col pb-24 lg:pb-0">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 select-none">
            Final Generated Output
          </h2>

          <div className="min-h-[200px] lg:min-h-[250px] mb-12">
            {generatedPrompt ? (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.3] text-zinc-900 tracking-tight transition-all duration-300 selection:bg-zinc-800 selection:text-white">
                {generatedPrompt}
              </p>
            ) : (
              <p className="text-2xl sm:text-3xl lg:text-4xl font-display font-medium leading-[1.3] text-zinc-300 tracking-tight transition-all duration-300 select-none">
                Your highly detailed architectural prompt will materialize here.
              </p>
            )}
          </div>

          <div>
            <button
              onClick={handleCopy}
              disabled={!generatedPrompt}
              className={`flex items-center justify-center w-full sm:w-auto px-10 py-4 rounded-xl text-sm font-sans font-bold transition-all duration-300 cursor-pointer ${
                !generatedPrompt
                  ? "bg-zinc-100 text-zinc-400 cursor-not-allowed shadow-none"
                  : copied
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-900/20 scale-[0.98]"
                  : "bg-black text-white hover:bg-zinc-800 hover:shadow-2xl hover:shadow-black/15 hover:-translate-y-1"
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
    </div>
  );
}
