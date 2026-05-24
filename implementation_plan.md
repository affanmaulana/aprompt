# PROMPTROOF: Architectural Prompt Generator
## Master Implementation Blueprint for AI Agent
[BACA SEBELUM MEMULAI]: Leverage System Default Skills
Antigravity Agent harus mengaktifkan Default Skills berikut selama proses eksekusi:

    Modular Component Extraction: Jangan menulis seluruh kode dalam satu file besar. Pecah UI menjadi komponen-komponen kecil yang terisolasi di dalam folder components/.

    Strict Type-Safe Fallbacks: Karena sistem ini mengandalkan manipulasi string mentah (pure string concatenation), gunakan fail-safe coding patterns (seperti optional chaining dan short-circuit evaluation) untuk mencegah aplikasi crash akibat state yang tidak terdefinisi (undefined atau null).

**Agent Objective:** 
Build a client-side, zero-latency text prompt generator tailored for Architectural Image-to-Image (I2I) workflows. The application operates strictly via string concatenation without any backend AI processing or API translation. Read this entire document before writing any code.

### 1. Tech Stack & Architecture
1.1 Project Directory Structure

Agen harus mematuhi struktur folder modular berikut secara disiplin:
src/
├── assets/          # Static assets (logos, icons)
├── components/      # UI Components
│   ├── CarriageInput.jsx
│   ├── LeftPanel.jsx
│   └── RightPanel.jsx
├── data/
│   └── schema.js    # Single Source of Truth untuk Gerbong Prompt
├── hooks/
│   └── useLocalStorage.js # Custom hook untuk sinkronisasi state
├── App.jsx          # Main Layout Hub & Global State
├── index.css        # Tailwind directives
└── main.jsx
*   **Framework:** React 18 (Initialized via Vite)
*   **Styling:** Tailwind CSS 3.4+
*   **Icons:** Lucide React
*   **Font:** Inter or SF Pro Display (System fonts)
*   **Storage:** Local Storage API only (No external database, zero latency).
*   **Routing:** None required. Single Page Application (SPA).

### 2. UI/UX & Aesthetic Guidelines
The design must adhere to a strict, Steve Jobs-approved minimalist aesthetic:
*   **Layout:** Two-column split screen. Left side (Form/Inputs) takes up 40% width, Right side (Output/Preview) takes up 60% width. Fixed viewport, no page-level scrolling (only internal div scrolling if necessary).
*   **Colors:** Monochromatic focus. Background: `#F9FAFB` (zinc-50) or pure white. Text: `#18181B` (zinc-900) for primary, `#71717A` (zinc-500) for secondary. Borders: `#E4E4E7` (zinc-200). Use exactly ONE accent color for active states (e.g., a subdued architectural blue `#2563EB` or stark black `#000000`).
*   **Typography:** High contrast in font weights. Titles in bold, clean sans-serif. No cluttered labels.
*   **Interactions:** Hover states on all buttons and dropdowns. Instant visual feedback. No animations longer than 150ms.

### 3. Data Structure: The "Sistem Gerbong" (Carriage System)
Create a `src/data/schema.js` file to hold the static structure. The prompt is built chronologically from these blocks. If a user selects "custom", a text input appears, and the user's raw string replaces `[VALUE]`.

```javascript
export const promptSchema = [
  {
    id: "source",
    title: "1. Source Context",
    template: "Based on the provided [VALUE], ",
    options: [
      { id: "sketchup", label: "Sketchup Raw Render", value: "raw 3D Sketchup clay render" },
      { id: "hand_sketch", label: "Hand Sketch", value: "hand-drawn architectural ink sketch" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "subject",
    title: "2. Architectural Subject",
    template: "transform it into a realistic architectural visualization of [VALUE], ",
    options: [
      { id: "shophouse", label: "Commercial Shophouse", value: "a modern 3-story commercial shophouse complex" },
      { id: "hospital", label: "Healthcare Facility", value: "a massive 3.3-hectare hospital development" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "material",
    title: "3. Materiality & Texture",
    template: "featuring rich material details including [VALUE], ",
    options: [
      { id: "concrete_glass", label: "Concrete & Glass", value: "exposed raw concrete finishes and large low-E glass panels" },
      { id: "wood_steel", label: "Timber & Steel", value: "warm timber cladding and black steel framing" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "environment",
    title: "4. Environment & Lighting",
    template: "captured during [VALUE] with cinematic lighting.",
    options: [
      { id: "golden_hour", label: "Golden Hour", value: "golden hour afternoon" },
      { id: "overcast", label: "Overcast", value: "moody overcast morning" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  }
];

4. Component Breakdown & State Management
A. Main State (App.jsx)

    Define a state object that stores the current selection for each carriage:
    const [selections, setSelections] = useState({ source: null, subject: null, material: null, environment: null });

    Define a state object for custom text inputs:
    const [customTexts, setCustomTexts] = useState({ source: "", subject: "", material: "", environment: "" });

    Local Storage Sync: Use a useEffect hook to load selections and customTexts from localStorage on initial mount, and another useEffect to save them whenever they change.

B. Left Panel (LeftPanel.jsx)

    Iterate over promptSchema and render a CarriageInput component for each.

    CarriageInput Component:

        Displays a minimal label (title).

        Renders a custom Select dropdown or a grid of selectable minimalist cards.

        Conditional Rendering: If the selected option is custom, immediately render a <textarea> underneath it with placeholder "Ketik detail spesifik di sini...".

        Update the global state onChange.

C. Right Panel (RightPanel.jsx)

    Live Text Preview: A large, visually prominent container displaying the concatenated string.

    String Concatenation Logic (Zero AI):

        Create a function generatePrompt() that maps over promptSchema.

        For each item, check if selections[item.id] is not null.

        If the selection is NOT "custom", take the selected option's value and inject it into the template, replacing [VALUE].

        If the selection IS "custom", take customTexts[item.id]. If empty, skip or show a placeholder. If filled, inject the raw text into the template, replacing [VALUE].

        Join all active carriage strings with a single space.

    Copy Button: A prominent, high-contrast button labeled "Copy Prompt". Use navigator.clipboard.writeText. Provide a 2-second "Copied!" state change using Lucide icons.

5. Edge Cases to Handle Explicitly

    Empty States: If a user hasn't selected a carriage, omit that specific carriage's template entirely from the final string. Do not leave dangling commas or broken sentences like transform it into a realistic architectural visualization of [VALUE].

    Custom Text Fallback: If a user selects "Ketik Sendiri" but leaves the textarea blank, treat it as an empty state (omit the carriage).
	Trailing Punctuation & Double Spaces Clean-up: Ketika pengguna memilih opsi "Ketik Sendiri" dan memasukkan teks secara manual, mereka sering kali mengakhiri ketikan dengan tanda titik atau koma ekstra (misal: "Lantai granit, dinding kayu."). Kode penyusunan string pada RightPanel.jsx harus membersihkan spasi ganda (double spaces) dan menghapus tanda baca di akhir input manual user sebelum digabungkan dengan gerbong berikutnya, agar tidak merusak struktur kalimat bahasa Inggris di template utama.
	Reset State Validation: Sediakan tombol "Reset Builder" di bagian bawah panel kiri. Saat diklik, fungsi ini wajib membersihkan seluruh isi localStorage dan mengembalikan state selections serta customTexts ke kondisi kosong (null dan "") secara instan tanpa perlu me-refresh halaman web.

6. Execution Steps for AI Agent

    Initialize Vite React project with Tailwind CSS.

    Clear default boilerplate.

    Implement schema.js.

    Build the layout shell (Left/Right panels).

    Implement state and Local Storage synchronization.

    Build CarriageInput and wire it to state.

    Build RightPanel string concatenation logic.

    Apply final aesthetic polishing (padding, typography, border colors).