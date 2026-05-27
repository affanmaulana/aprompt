# Interior Rendering System Architecture Guide

Welcome to the **Interior Rendering System Architecture Guide**. This document provides an exhaustive breakdown of the Interior render mode inside Aprompt, including its data structures, dynamic filtering, semantic compilation lifecycle, implicit visual directives, and customization workflows.

---

## 1. System Overview & Philosophy

The Interior rendering mode is designed to generate highly realistic, professional-grade computer-generated imagery (CGI) briefing prompts for indoor architectural designs and room stylings. In an indoor setting, maintaining spatial boundary constraints (wall placement, ceiling heights, window alignments) is paramount, as is simulating fine micro-surface details (wood grain, stone veining, fabric weaves) and natural light scattering.

The system structures inputs via **Carriages** and relies on a highly sophisticated semantic engine to compile sentences that evoke high-end editorial and publication-grade interior design aesthetics.

```
+--------------------------------------------------------------+
|                     INTERIOR RENDER MODE                     |
|  (Focuses on room boundaries, indoor finishes, styling details) |
+------------------------------+-------------------------------+
                               |
                               v (Filters active carriages)
+------------------------------+-------------------------------+
|                       CARRIAGE SCHEMA                        |
|   (Essentials  |  Camera & Framing  |  Env  |  Narrative)    |
+------------------------------+-------------------------------+
                               |
                               v (Resolves options + custom text)
+------------------------------+-------------------------------+
|                SEMANTIC ASSEMBLY COMPILER                    |
|  - Phase 1: Semantic Clash Prevention                        |
|  - Phase 2: Category-Aware Implicit Boundary Guidelines      |
|  - Phase 3: Tilt-Shift Perspective Correction                |
|  - Phase 4: Clean Corner-Wall Composition Framing            |
|  - Phase 5: High-fidelity Micro-surface Interior Materials   |
|  - Phase 6: ArchDaily-grade Filmic Output Post-processing    |
+------------------------------+-------------------------------+
                               |
                               v
   "Act as a professional CGI director specializing in..."
```

---

## 2. Data Schema Definition (`schema.js`)

In `src/data/schema.js`, the Interior rendering system is configured under the category `{ id: 'interior', title: 'Interior', icon: 'Layout', order: 2 }`.

Below is the catalog of carriages active in Interior mode, grouped by their UI navigation sections:

### 2.1 essentials (Essentials Group)
These parameters specify the room and architectural envelope.
*   **Interior Space / Room (`interior_space`)**: Specifies the room type (e.g., Living Room, Bedroom, Dining Room, Kitchen, Lobby, Cafe & Restaurant, Office Workspace, Library, Bathroom).
    *   *Template*: `of a [VALUE]`
    *   *Properties*: Required, Expandable, allows detailed custom text inputs.
*   **Interior Design Style (`interior_style`)**: Dictates the aesthetic language (e.g., Minimalist, Scandinavian, Industrial Loft, Mid-Century Modern, Japandi, Art Deco, Modern Classical).
    *   *Template*: `in [VALUE] design style`
    *   *Properties*: Required, Expandable, allows custom inputs.
*   **Interior Materiality & Finishes (`interior_material`)**: Represents interior wall, floor, and surface finishes. It is configured as a `multi-select` input.
    *   *Template*: `featuring [VALUE]` (Automatically rewritten in compiler to: `featuring high-fidelity representation of [VALUE] interior finishes`)
    *   *Options*: Micro-cement, Oak Paneling, Polished Terrazzo, Exposed Brick, Marble Surfaces, Brushed Brass.

### 2.2 camera (Camera & Framing Group)
*   **Camera Angle (`camera_angle`)**: Specifies the interior viewpoint (e.g., Eye Level, Low Angle, High Angle, bird eye view). Shared across categories.
    *   *Template*: `captured from [VALUE]`
*   **Composition Control (`composition`)**: Governs the visual balance (e.g., Negative Space, Visual Hierarchy, Leading Lines). Shared `multi-select` carriage.
    *   *Template*: `emphasizing [VALUE]`

### 2.3 environment (Environment & Context Group)
Configures lighting, weather, and decorative styling.
*   **Lighting (`lighting`)**: Dictates the primary illumination source (e.g., Golden Hour, Overcast Soft Light, Morning Light, Sunset Glow, Volumetric God Rays). Shared carriage.
    *   *Template*: `illuminated by [VALUE]`
*   **Weather Conditions (`weather`)**: Simulates the light bleeding through windows from outside weather (e.g., Sunny Clear Sky, Partly Cloudy, Dense Fog, Light Rain). Shared carriage.
    *   *Template*: `under [VALUE] conditions`
*   **Atmosphere & Mood (`atmosphere`)**: Generates indoor vibes (e.g., suburban calm, serene coastal, forest retreat). Shared carriage.
    *   *Template*: `set in a [VALUE] atmosphere`
*   **Styling & Decor Details (`interior_details`)**: Fills the room with small props and soft decorations (e.g., Indoor Plants, Artwork Frames, Linen Curtains, Coffee Books, Ambient LED). It is a `multi-select` carriage.
    *   *Template*: `decorated with [VALUE]`

### 2.4 narrative (Narrative & Context Group)
*   **Furniture Layout (`interior_furniture`)**: Dictates major furniture pieces (e.g., Modular Sofa, Designer Lounge Chair, Timber Credenza, Floating Shelves, Plush Rug). It is a `multi-select` carriage.
    *   *Template*: `furnished with [VALUE]`
*   **Human Presence (`human_presence`)**: Populates the space with figures (e.g., No Humans, Few Scattered Figures, Moderate Crowd). Shared carriage.
    *   *Template*: `populated with [VALUE]`
*   **Human Activity (`human_activity`)**: Focuses on indoor actions (e.g., Casual Walking, Conversing, Waiting, Family Activities). Shared `multi-select` carriage.
    *   *Template*: `engaged in [VALUE]`
*   **Storytelling Context (`storytelling`)**: Mood evocations (e.g., Quiet Residential Life, Weekend Leisure, Luxury Lifestyle). Shared carriage.
    *   *Template*: `evoking a mood of [VALUE]`

---

## 3. The Semantic Assembly Engine (`promptEngine.js`)

When compiling an Interior prompt, the engine (`src/engine/promptEngine.js`) applies critical automated logic divided into six distinct lifecycle phases:

```
[User Form Selection]
       │
       ▼
Phase 1: Semantic Clash Prevention (Clean conflict inputs: No Humans -> wipe activities)
       │
       ▼
Phase 2: Category-Aware Implicit Boundary Guidelines (Inject room structure, walls, and ceiling height rules)
       │
       ▼
Phase 3: Tilt-Shift Lens Directive (Inject automatic perspective correction & vertical alignment)
       │
       ▼
Phase 4: Composition Framing Directive (Inject clean framing lines/walls strictly at borders)
       │
       ▼
Phase 5: High-fidelity Interior Material Resolution (Inject wood grain, stone veining, fabric weaves, and light scattering)
       │
       ▼
Phase 6: Photorealistic Filmic Post-Processing (Inject 5500k color science, HD Archdaily specs)
       │
       ▼
[Final Compiled Interior Prompt]
```

### Phase 1: Semantic Clash Prevention
The engine cleans up mutually exclusive selections to prevent catastrophic rendering conflicts:
1.  **Human Conflict**: If `human_presence` is set to `'no_humans'`, any active selections inside `human_activity` are deleted. Additionally, if the user selected figure-dependent motion blurs in the shared state, they are wiped.

### Phase 2: Category-Aware Implicit Guidelines
To protect the spatial boundaries of the room, the engine injects a strict **room-preservation rule**:
*   *Injected String*: `with strict instruction to preserve the interior room structure, original wall layouts, ceiling height, and window placements, ensuring absolutely no architectural elements are altered, added, or removed, and explicitly preventing any furniture elements from distorting the spatial bounds of the architecture`
*   *Semantic Role*: `geometry` (appended into the main subject sentence).

### Phase 3: Tilt-Shift Lens Default Perspective Correction
Professional interior photography demands parallel vertical lines. The engine automatically injects:
*   If `camera_angle` is selected, it appends: `using a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`
*   If `camera_angle` is omitted, it injects a standalone camera directive: `captured with a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`

### Phase 4: Composition Framing Default Directive
For interior scenes, the framing must utilize walls/columns placed strictly at the borders to avoid cluttering the central view:
*   *Injected String*: `utilizing clean, balanced framing lines (such as subtle structural walls or columns strictly at the edge of the frame) positioned strictly in the extreme corners of the frame, ensuring the main interior space remains 100% unobstructed, sharp, clear, and visually balanced`
*   *Integration*: Merges cleanly into the `composition` semantic block.

### Phase 5: High-fidelity Interior Material Resolution
Interior surfaces demand micro-texture accuracy. The engine automatically enhances the material description:
*   If `interior_material` is selected, it appends: `with realistic wood grain patterns, high-fidelity stone veining, fabric weave textures, and physically accurate light scattering and reflection`
*   If no interior material is selected, it injects a default material value: `featuring high-fidelity interior material representation, realistic wood grain patterns, stone veining, fabric weaves, and physically accurate light scattering`

### Phase 6: Output & Post-Processing Specifications
Every prompt is appended with professional publishing metadata:
*   *Injected String*: `rendered at photorealistic ultra-high definition, with filmic clean post-processing and neutral 5500k color science, suitable for Archdaily publication`
*   *Semantic Role*: `output` (final compiled sentence).

---

## 4. UI Rendering & Interaction Flow (`App.jsx` & `LeftPanel.jsx`)

1.  **State Synchronization**: When `activeCategory` is set to `'interior'`, the app instantly filters `promptSchema` down to carriages containing `categories: ['interior']` or global carriages.
2.  **Display Filtering**:
    ```javascript
    const activeSchema = promptSchema.filter(
      item => !item.categories || item.categories.includes('interior')
    );
    ```
    This reduces the system's schema down to the highly focused interior parameters, hiding exterior-only options like land-shaping and street contexts.
3.  **Local Storage**: All selections under the interior tab are cached under keys `aprompt_selections` and `aprompt_customTexts` separate from other render modes, ensuring seamless tabs toggling.

---

## 5. Developer Guide: Modifying the Interior System

### How to Add a New Room Option
1.  Open [`src/data/schema.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/data/schema.js).
2.  Locate the carriage with `id: 'interior_space'`.
3.  Add your new option into the `options` array:
    ```javascript
    { id: 'meeting_room', label: 'Meeting Room', value: 'Modern Meeting Room' }
    ```
4.  Open English translation file [`src/translations/en.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/en.json) and add:
    ```json
    "option.meeting_room": "Meeting Room"
    ```
5.  Open Indonesian translation file [`src/translations/id.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/id.json) and add:
    ```json
    "option.meeting_room": "Ruang Pertemuan"
    ```

### How to Adjust the Implicit Interior Geometry Preservation Rules
1.  Open [`src/engine/promptEngine.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/engine/promptEngine.js).
2.  Find the `interior` block for `geometryText` around line 83-84:
    ```javascript
    if (activeCategory === 'interior') {
      geometryText = 'with strict instruction to preserve the interior room structure...';
    }
    ```
3.  Modify the literal string value to alter the default prompts generated across all interior renderings.
