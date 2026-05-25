# Aprompt — System Architecture & Developer Guide

Welcome to the **Aprompt Architecture Guide**. This document outlines the inner workings of Aprompt (v3), a zero-latency, client-side architectural CGI briefing compiler. 

This guide is designed for developers and AI coding assistants to quickly grasp how the application is structured and how to expand it—specifically for adding or refining **Interior**, **Cityscape**, or future rendering categories.

---

## 1. System Philosophy

Aprompt is built on a **Dynamic Semantic Module Paradigm** (historically called the "Carriage System"). Instead of treating prompts as static text templates, it models prompts like an architectural CGI director thinks, separating specifications into logical layers:

```
+--------------------------------------------------------------+
|                      RENDER CATEGORY                         |
|             (Exterior / Interior / Cityscape)                |
+------------------------------+-------------------------------+
                               |
                               v (Filters visible carriages)
+------------------------------+-------------------------------+
|                       CARRIAGE SCHEMA                        |
|   (Essentials  |  Camera & Framing  |  Env  |  Narrative)    |
+------------------------------+-------------------------------+
                               |
                               v (Matches active IDs)
+------------------------------+-------------------------------+
|                       SELECTION STATE                        |
|         (Standard Options & Custom Text Specifications)      |
+------------------------------+-------------------------------+
                               |
                               v (Compiles & Injects Implicit Rules)
+------------------------------+-------------------------------+
|                   PROMPT ASSEMBLY ENGINE                     |
|           (Category-Aware Sentences & Micro-details)         |
+------------------------------+-------------------------------+
                               |
                               v
                  "Act as a professional CGI..."
```

---

## 2. Directory Structure & Key Files

The codebase is highly modular, separating data schema, compiler logic, translation definitions, and UI layouts:

*   [`src/data/schema.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/data/schema.js) — **Single Source of Truth**. Contains the lists of categories, input modules (carriages), and options.
*   [`src/engine/promptEngine.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/engine/promptEngine.js) — **Brief Compiler**. Performs semantic checks, injects implicit professional directives, and formats lists grammatically.
*   [`src/App.jsx`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/App.jsx) — **Main Layout Hub & State**. Syncs selections and active category with local storage, and handles randomized selections.
*   [`src/components/LeftPanel.jsx`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/components/LeftPanel.jsx) — **Builder UI**. Renders the category segment selector, sidebar anchors, and the input fields.
*   [`src/components/RightPanel.jsx`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/components/RightPanel.jsx) — **Preview & Action UI**. Compiles the selected prompt and handles copying to clipboard.
*   [`src/translations/`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/) — **Bilingual Dictionaries**. Holds `en.json` and `id.json` mappings for all parameters, labels, and placeholders.

---

## 3. Data Schema Architecture (`schema.js`)

Each dynamic module is represented by a **Carriage Object** in `promptSchema`. Below is the architectural definition of a carriage:

```javascript
{
  id: 'interior_space',               // Unique identifier for selection state
  title: 'Interior Space / Room',     // UI display label (keys to translation files)
  category: 'project',                // Internal metadata categorization
  group: 'essentials',                // Navigation group (essentials | camera | environment | narrative)
  categories: ['interior'],           // Categories where this parameter is active
  order: 1,                           // Display sorting order within its group
  priority: 'required',               // Visual emphasis in input panels
  template: 'of a [VALUE]',           // The grammar wrapper. [VALUE] is replaced by selections.
  enabled: true,                      // Global override flag
  expandable: true,                   // Allows manual input expansions
  semanticPart: 'subject',            // Target sentence index for prompt compilation
  allowDetailInput: true,             // Direct text-area details attached to single options
  options: [                          // Standard options grid
    { id: 'living_room', label: 'Living Room', value: 'Living Room' },
    ...
  ]
}
```

### The Category Filter
To support a clean, compact UI that adapts to `Exterior`, `Interior`, and `Cityscape` modes, every carriage has a `categories` array. 
*   If `categories` is missing, it is considered **global** (shared across all modes).
*   If `categories` contains `['interior']`, it will only render when the active mode is set to Interior.

---

## 4. State & Dynamic Filtering (`App.jsx`)

The React core keeps three primary states synced instantly with the browser's `localStorage` via a custom `useLocalStorage` hook:

1.  `activeCategory` — Syncs the current render mode (`'exterior'`, `'interior'`, `'cityscape'`).
2.  `selections` — Maps carriage `id` to the user's selected option (`optionId`, arrays for multi-select, or booleans).
3.  `customTexts` — Maps carriage `id` to custom details entered in the textareas.

### How UI Compactness is Achieved
Inputs are filtered on the fly before they are passed down to render panels:
```javascript
const activeSchema = promptSchema.filter(
  item => !item.categories || item.categories.includes(activeCategory)
);
```
This filters the 20+ total options down to a compact list of ~10–12 visual controls per category, keeping the interface highly focused and zero-latency.

---

## 5. The Semantic Assembly Engine (`promptEngine.js`)

Prompts are generated on the client side using the `assemblePrompt` function. The compilation lifecycle consists of six distinct phases:

### Phase 1: Semantic Clash Prevention
The engine cleans up mutually exclusive inputs to prevent contradictory outputs:
*   If `human_presence === 'no_humans'`, any selected `human_activity` or movement-specific `motion` blur options are programmatically deleted.
*   If `vehicle` contains `'no_vehicles'`, all other vehicles are removed and vehicle trail effects are omitted.

### Phase 2: Category-Aware Implicit Guidelines
To bridge the gap between simple user inputs and world-class rendering agency outputs, the engine dynamically injects hidden professional instructions based on the active category:

*   **Geometry Preservation**:
    *   `exterior`: Instructs the renderer to preserve rooflines, facades, and massing.
    *   `interior`: Instructs the renderer to strictly preserve the room boundaries, wall placement, and ceiling height.
    *   `cityscape`: Instructs the renderer to preserve block layouts, skyline silhouettes, and street grids.
*   **Material Fidelity Enhancement**:
    *   `interior`: Automatically appends rules for high-resolution wood grain, stone veining, fabric weave, and physically accurate light scattering.
    *   `exterior`/`cityscape`: Automatically appends glass refraction and reflection instructions.

### Phase 3: Sentence Formatting
Inputs are compiled into sentences via `promptSentenceConfig`. Each sentence configuration maps `semanticPart` values (like `subject`, `camera`, `lighting`) into logical sentences, separating elements with clean grammar (`A, B, and C` listing formatting via `formatList()`).

---

## 6. How to Extend or Add a Render Mode

Adding new capabilities (e.g., expanding the newly established Interior/Cityscape system or adding a new "Product Render" category) is straightforward and requires zero modifications to the UI structure.

### Step 1: Define the Mode in `schema.js`
Add a new object to the `renderCategories` array:
```javascript
export const renderCategories = [
  ...
  { id: 'product', title: 'Product Showcase', icon: 'Box', order: 4 }
];
```

### Step 2: Configure Carriages in `schema.js`
Define your new inputs and tag them with your category ID:
```javascript
{
  id: 'product_backdrop',
  title: 'Backdrop Setting',
  group: 'environment',
  categories: ['product'], // ONLY visible in Product Mode
  order: 22,
  template: 'placed on a [VALUE] background',
  options: [
    { id: 'monolithic_stone', label: 'Monolithic Stone', value: 'brushed concrete monolithic plinth' },
    { id: 'studio_cyclorama', label: 'Studio Cyclorama', value: 'infinite white studio cyclorama' }
  ]
}
```

### Step 3: Add Custom Engine Rules in `promptEngine.js`
Tailor the implicit geometry, materiality, and camera lenses for your new category:
```javascript
if (activeCategory === 'product') {
  geometryText = 'with strict instructions to preserve original packaging proportions and product silhouettes';
}
```

### Step 4: Add Translation Strings
Add keys inside `src/translations/en.json` and `src/translations/id.json` for:
1.  The category tab: `"tabs.product": "Product"`
2.  The parameter titles: `"param.product_backdrop": "Backdrop Setting"`
3.  The options: `"option.monolithic_stone": "Monolithic Stone"`

Your new category is now fully functional, persistent in local storage, responsive across viewports, and compiles perfectly!
