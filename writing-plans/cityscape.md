# Cityscape Rendering System Architecture Guide

Welcome to the **Cityscape Rendering System Architecture Guide**. This document provides an exhaustive breakdown of the Cityscape render mode inside Aprompt, including its data structures, dynamic filtering, semantic compilation lifecycle, implicit visual directives, and customization workflows.

---

## 1. System Overview & Philosophy

The Cityscape rendering mode is designed to generate highly realistic, professional-grade computer-generated imagery (CGI) briefing prompts for macro-level urban designs, skyline vistas, old towns, and futuristic city configurations. In a cityscape setting, preserving the urban morphology, skyline silhouette, block grids, and street patterns is crucial to prevent the AI from synthesizing erratic landscapes or chaotic structural placements.

The system structures inputs via **Carriages** and relies on a highly sophisticated semantic engine to compile sentences that evoke high-end editorial and publication-grade urban design aesthetics.

```
+--------------------------------------------------------------+
|                     CITYSCAPE RENDER MODE                    |
|  (Focuses on urban morphology, skylines, and streetscapes)   |
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
|  - Phase 2: Category-Aware Implicit Morphology Guidelines    |
|  - Phase 3: Tilt-Shift Perspective Correction                |
|  - Phase 4: Soft Vignetting Composition Framing             |
|  - Phase 5: High-fidelity Urban Material Resolution          |
|  - Phase 6: ArchDaily-grade Filmic Output Post-processing    |
+------------------------------+-------------------------------+
                               |
                               v
   "Act as a professional CGI director specializing in..."
```

---

## 2. Data Schema Definition (`schema.js`)

In `src/data/schema.js`, the Cityscape rendering system is configured under the category `{ id: 'cityscape', title: 'Cityscape', icon: 'Building2', order: 3 }`.

Below is the catalog of carriages active in Cityscape mode, grouped by their UI navigation sections:

### 2.1 essentials (Essentials Group)
These parameters specify the core urban context and building types.
*   **Cityscape Subject (`city_subject`)**: Specifies the core macro subject (e.g., Metropolis Skyline, Historic Old Town, Coastal Promenade, Futuristic Smart City, Venetian Canals).
    *   *Template*: `[VALUE]`
    *   *Properties*: Required, Expandable, allows detailed custom text inputs.
*   **Urban Architecture Style (`city_style`)**: Dictates the dominant architectural style of buildings (e.g., Modernist Skyscrapers, Classic European Blocks, Biophilic Green Structures, Brutalist Megastructures, Cyberpunk Cyber-Grid).
    *   *Template*: `featuring [VALUE] buildings`
    *   *Properties*: Required, Expandable, allows custom inputs.
*   **Urban Density (`city_density`)**: Specifies block structure spacing (e.g., High-rise Density, Low-rise Sprawl, Balanced Mixed-use, Mega-block Cluster).
    *   *Template*: `with [VALUE] density`
    *   *Properties*: Required, Expandable.

### 2.2 camera (Camera & Framing Group)
*   **Camera Angle (`camera_angle`)**: Specifies the viewpoint (e.g., Bird Eye View, Drone Perspective, Street Perspective, Low Angle). Shared carriage.
    *   *Template*: `captured from [VALUE]`
*   **Composition Control (`composition`)**: Governs dynamic structural framing (e.g., Dominant Sky Ratio, Visual Hierarchy, Leading Lines). Shared `multi-select` carriage.
    *   *Template*: `emphasizing [VALUE]`

### 2.3 environment (Environment & Context Group)
Configures lighting, weather, geographical settings, and infrastructural elements.
*   **Lighting (`lighting`)**: Dictates the primary illumination source (e.g., Golden Hour, Blue Hour, Sunset Glow, Volumetric God Rays). Shared carriage.
    *   *Template*: `illuminated by [VALUE]`
*   **Weather Conditions (`weather`)**: Simulates weather impact over massive urban areas (e.g., sunny clear sky, partly cloudy, dense fog, gentle mist, heavy monsoon rain). Shared carriage.
    *   *Template*: `under [VALUE] conditions`
*   **Atmosphere & Mood (`atmosphere`)**: Generates climate moods (e.g., dense urban, serene coastal, mediterranean warm). Shared carriage.
    *   *Template*: `set in a [VALUE] atmosphere`
*   **Geographical Context (`geo_context`)**: Anchor city location (e.g., Jakarta, Tokyo, New York, Singapore, London). Shared carriage.
    *   *Template*: `located in [VALUE]`
*   **Street Context (`street`)**: Infrastructure immediately fronting the focal block (e.g., smooth asphalt road, urban boulevard, paving block surface). Shared carriage.
    *   *Template*: `fronting a [VALUE]`
*   **Urban Infrastructure (`city_elements`)**: Connective features running through the city (e.g., Elevated Monorail, Pedestrian Plazas, Sky-Bridges, Bustling Canals, Pocket Parks). It is a `multi-select` carriage.
    *   *Template*: `interwoven with [VALUE]`

### 2.4 narrative (Narrative & Context Group)
*   **Vehicle Context (`vehicle`)**: Macro traffic present in streets or channels (e.g., Luxury Sedans, Family SUVs, Public Transport, Motorcycles, No Vehicles). Shared `multi-select` carriage.
    *   *Template*: `with [VALUE] present`
*   **Human Presence (`human_presence`)**: Populates urban walkways (e.g., Moderate Crowd, Busy Urban Crowd, Few Scattered Figures). Shared carriage.
    *   *Template*: `populated with [VALUE]`
*   **Human Activity (`human_activity`)**: Focuses on urban actions (e.g., Casual Walking, Cycling, Conversing, Window Shopping, Jogging). Shared `multi-select` carriage.
    *   *Template*: `engaged in [VALUE]`
*   **Motion System (`motion`)**: Simulates traffic flow and movement trails (e.g., Cinematic Motion Blur, Crowd Motion Blur, Vehicle Motion Trail). Shared carriage.
    *   *Template*: `with [VALUE]`
*   **Storytelling Context (`storytelling`)**: Evocations of city pulse (e.g., Business District Energy, Morning Commute, community gathering). Shared carriage.
    *   *Template*: `evoking a mood of [VALUE]`

---

## 3. The Semantic Assembly Engine (`promptEngine.js`)

When compiling a Cityscape prompt, the engine (`src/engine/promptEngine.js`) applies critical automated logic divided into six distinct lifecycle phases:

```
[User Form Selection]
       │
       ▼
Phase 1: Semantic Clash Prevention (Clean conflict inputs: No Humans -> wipe activities/crowd motion; No Vehicles -> wipe traffic trail)
       │
       ▼
Phase 2: Category-Aware Implicit Morphology Guidelines (Inject urban morphology, skyline silhouette, and grid preservation)
       │
       ▼
Phase 3: Tilt-Shift Lens Directive (Inject automatic perspective correction & vertical alignment)
       │
       ▼
Phase 4: Composition Framing Directive (Inject out-of-focus corner border silhouettes)
       │
       ▼
Phase 5: High-fidelity Urban Material Resolution (Inject glass reflections & texture enhancements)
       │
       ▼
Phase 6: Photorealistic Filmic Post-Processing (Inject 5500k color science, HD Archdaily specs)
       │
       ▼
[Final Compiled Cityscape Prompt]
```

### Phase 1: Semantic Clash Prevention
The engine cleans up mutually exclusive selections to prevent catastrophic rendering conflicts:
1.  **Human Conflict**: If `human_presence` is set to `'no_humans'`, any active selections inside `human_activity` are deleted. Additionally, if the user selected figure-dependent motion blurs (`selective_motion_blur_on_figures` or `crowd_motion_blur`), they are wiped.
2.  **Vehicle Conflict**: If `vehicle` selections contain `'no_vehicles'`, the array is sanitized to only contain `['no_vehicles']` and any custom vehicle text is cleared. If the user selected `vehicle_motion_trail` in the motion system, it is safely deleted.

### Phase 2: Category-Aware Implicit Guidelines
To protect the urban layout integrity, the engine injects a strict **urban-morphology preservation rule**:
*   *Injected String*: `with strict instruction to preserve the existing urban morphology, skyline silhouette, block layouts, and street grids, ensuring absolutely no architectural or infrastructural elements are altered or distorted, and explicitly preventing any structures from being replaced by erratic landscape features`
*   *Semantic Role*: `geometry` (appended into the main subject sentence).

### Phase 3: Tilt-Shift Lens Default Perspective Correction
Professional cityscape photography demands parallel vertical lines. The engine automatically injects:
*   If `camera_angle` is selected, it appends: `using a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`
*   If `camera_angle` is omitted, it injects a standalone camera directive: `captured with a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`

### Phase 4: Composition Framing Default Directive
For cityscape views, the framing utilizes out-of-focus background borders or silhouettes strictly in the corners:
*   *Injected String*: `utilizing soft, out-of-focus framing elements (such as clean architectural silhouettes, subtle structural borders, or distant organic elements) positioned strictly in the extreme corners of the frame, ensuring the main facade and architectural focal points remain 100% unobstructed, sharp, and clear`
*   *Integration*: Merges cleanly into the `composition` semantic block.

### Phase 5: High-fidelity Urban Material Resolution
Cityscapes are heavy on steel, glass, and concrete structures. The engine automatically enhances the material description:
*   *Injected String*: `featuring high-fidelity material representation, realistic glass reflection and refraction, and enhanced micro-surface texture resolution`
*   *Integration*: Injected into the global `material` semantic slot (using default `material` since `activeCategory !== 'interior'`).

### Phase 6: Output & Post-Processing Specifications
Every prompt is appended with professional publishing metadata:
*   *Injected String*: `rendered at photorealistic ultra-high definition, with filmic clean post-processing and neutral 5500k color science, suitable for Archdaily publication`
*   *Semantic Role*: `output` (final compiled sentence).

---

## 4. UI Rendering & Interaction Flow (`App.jsx` & `LeftPanel.jsx`)

1.  **State Synchronization**: When `activeCategory` is set to `'cityscape'`, the app filters `promptSchema` down to carriages containing `categories: ['cityscape']` or global carriages.
2.  **Display Filtering**:
    ```javascript
    const activeSchema = promptSchema.filter(
      item => !item.categories || item.categories.includes('cityscape')
    );
    ```
    This hides interior-only options like furniture layouts and room finishes, as well as exterior landscape strategies.
3.  **Local Storage**: All selections under the cityscape tab are cached under keys `aprompt_selections` and `aprompt_customTexts` separate from other render modes, ensuring seamless tabs toggling.

---

## 5. Developer Guide: Modifying the Cityscape System

### How to Add a New Cityscape Subject Option
1.  Open [`src/data/schema.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/data/schema.js).
2.  Locate the carriage with `id: 'city_subject'`.
3.  Add your new option into the `options` array:
    ```javascript
    { id: 'suburban_neighborhood', label: 'Suburban Neighborhood', value: 'Suburban Residential Neighborhood' }
    ```
4.  Open English translation file [`src/translations/en.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/en.json) and add:
    ```json
    "option.suburban_neighborhood": "Suburban Neighborhood"
    ```
5.  Open Indonesian translation file [`src/translations/id.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/id.json) and add:
    ```json
    "option.suburban_neighborhood": "Lingkungan Suburban"
    ```

### How to Adjust the Implicit Cityscape Geometry Preservation Rules
1.  Open [`src/engine/promptEngine.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/engine/promptEngine.js).
2.  Find the `cityscape` block for `geometryText` around line 85-86:
    ```javascript
    } else if (activeCategory === 'cityscape') {
      geometryText = 'with strict instruction to preserve the existing urban morphology...';
    }
    ```
3.  Modify the literal string value to alter the default prompts generated across all cityscape renderings.
