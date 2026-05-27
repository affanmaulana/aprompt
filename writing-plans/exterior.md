# Exterior Rendering System Architecture Guide

Welcome to the **Exterior Rendering System Architecture Guide**. This document provides an exhaustive breakdown of the Exterior render mode inside Aprompt, including its data structures, dynamic filtering, semantic compilation lifecycle, implicit visual directives, and customization workflows.

---

## 1. System Overview & Philosophy

The Exterior rendering mode is designed to generate highly realistic, professional-grade computer-generated imagery (CGI) briefing prompts for outdoor architectural designs. It models the reasoning of an architectural CGI director and photographer, organizing parameters into logical blocks called **Carriages** (derived from the "Carriage System" paradigm) and combining them into a grammatically flawless, highly detailed descriptive prompt.

```
+--------------------------------------------------------------+
|                     EXTERIOR RENDER MODE                     |
|  (Focuses on structural massing, facade materials, landscape) |
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
|  - Phase 2: Category-Aware Implicit Preservation Guidelines  |
|  - Phase 3: Tilt-Shift Perspective Correction                |
|  - Phase 4: Corner-Vignetting Composition Framing           |
|  - Phase 5: High-fidelity Facade Material Resolution         |
|  - Phase 6: ArchDaily-grade Filmic Output Post-processing    |
+------------------------------+-------------------------------+
                               |
                               v
   "Act as a professional CGI director specializing in..."
```

---

## 2. Data Schema Definition (`schema.js`)

In `src/data/schema.js`, the Exterior rendering system is configured under the category `{ id: 'exterior', title: 'Exterior', icon: 'Home', order: 1 }`. 

The input parameters are defined dynamically using **Carriage Objects**. Below is the catalog of carriages active in Exterior mode, grouped by their UI navigation sections:

### 2.1 essentials (Essentials Group)
These parameters specify the core subject and visual envelope of the exterior design.
*   **Subject Description (`subject`)**: Specifies the core building type (e.g., Residential House, Luxury Villa, Townhouse, Office Tower, Museum).
    *   *Template*: `[VALUE]`
    *   *Properties*: Required, Expandable, allows detailed custom text inputs.
*   **Architectural Style (`arch_style`)**: Dictates the aesthetic language (e.g., Minimalist, Modern Tropical, Contemporary, Brutalist, Scandinavian, Japandi).
    *   *Template*: `in [VALUE] style`
    *   *Properties*: Required, Expandable, allows custom inputs.
*   **Materiality & Finishes (`material`)**: Represents the facade materials. It is configured as a `multi-select` input.
    *   *Template*: `featuring [VALUE]` (Automatically rewritten in compiler to: `featuring high-fidelity representation of [VALUE] materiality`)
    *   *Options*: Concrete, Natural Stone, Red Brick, Timber, Black Steel, Plaster, Corten Steel, Bamboo.

### 2.2 camera (Camera & Framing Group)
These parameters simulate real-world camera properties.
*   **Camera Angle (`camera_angle`)**: Specifies the viewpoint (e.g., Eye Level, Low Angle, Bird Eye View, Drone Perspective, Street Perspective).
    *   *Template*: `captured from [VALUE]`
*   **Composition Control (`composition`)**: Governs the dynamic frame arrangement (e.g., Negative Space, Dominant Sky Ratio, Strong Foreground, Building Dominance). It is a `multi-select` carriage.
    *   *Template*: `emphasizing [VALUE]`

### 2.3 environment (Environment & Context Group)
Configures lighting, weather, geography, and context surroundings.
*   **Lighting (`lighting`)**: Dictates the time of day and sunlight behavior (e.g., Golden Hour, Blue Hour, Overcast Soft Light, Morning Light, Sunset Glow, Volumetric God Rays).
    *   *Template*: `illuminated by [VALUE]`
*   **Weather Conditions (`weather`)**: Adds physical atmosphere (e.g., Sunny Clear Sky, Partly Cloudy, Dense Fog, Light Rain, Heavy Monsoon Rain).
    *   *Template*: `under [VALUE] conditions`
*   **Atmosphere & Mood (`atmosphere`)**: Generates climate moods (e.g., Tropical Lush, Mediterranean Warm, Dense Urban, Serene Coastal, Forest Retreat).
    *   *Template*: `set in a [VALUE] atmosphere`
*   **Geographical Context (`geo_context`)**: Anchor location (e.g., Bali, Jakarta, Singapore, Tokyo, New York).
    *   *Template*: `located in [VALUE]`
*   **Landscape Strategy (`landscape`)**: Surrounding softscape elements (e.g., Minimal Landscape, Lush Tropical Garden, Manicured Formal Garden, Water Feature Landscape).
    *   *Template*: `surrounded by [VALUE]`
*   **Street Context (`street`)**: Infrastructure immediately fronting the facade (e.g., Smooth Asphalt Road, Concrete Paved Road, shared pedestrian street, Urban Boulevard).
    *   *Template*: `fronting a [VALUE]`

### 2.4 narrative (Narrative & Context Group)
Simulates active life, movement, and storytelling.
*   **Vehicle Context (`vehicle`)**: Vehicles parked or moving (e.g., Luxury Sedans, Family SUVs, Electric Vehicles, Motorcycles, Public Transport, No Vehicles). It is a `multi-select` input.
    *   *Template*: `with [VALUE] present`
*   **Human Presence (`human_presence`)**: Populates the scene (e.g., No Humans, Few Scattered Figures, Moderate Crowd).
    *   *Template*: `populated with [VALUE]`
*   **Human Activity (`human_activity`)**: Focuses on actions (e.g., Casual Walking, Cycling, Conversing, Family Activities, Jogging). `multi-select` input.
    *   *Template*: `engaged in [VALUE]`
*   **Motion System (`motion`)**: Controls camera shutter/speed artifacts (e.g., No Motion Blur, Selective Motion Blur on Figures, Cinematic Motion Blur, Vehicle Motion Trail).
    *   *Template*: `with [VALUE]`
*   **Storytelling Context (`storytelling`)**: Mood evocations (e.g., Quiet Residential Life, Weekend Leisure, Business District Energy, Community Gathering).
    *   *Template*: `evoking a mood of [VALUE]`

---

## 3. The Semantic Assembly Engine (`promptEngine.js`)

When compiling an Exterior prompt, the engine (`src/engine/promptEngine.js`) applies critical automated logic divided into six distinct lifecycle phases:

```
[User Form Selection]
       │
       ▼
Phase 1: Semantic Clash Prevention (Clean conflict inputs: No Humans -> wipe activities/crowd motion)
       │
       ▼
Phase 2: Category-Aware Implicit Geometry Guidelines (Inject structural facade/roofline preservation)
       │
       ▼
Phase 3: Tilt-Shift Lens Directive (Inject automatic perspective correction & vertical alignment)
       │
       ▼
Phase 4: Composition Framing Directive (Inject out-of-focus corner border vignettes)
       │
       ▼
Phase 5: High-fidelity Facade Material Resolution (Inject glass reflections & texture enhancements)
       │
       ▼
Phase 6: Photorealistic Filmic Post-Processing (Inject 5500k color science, HD Archdaily specs)
       │
       ▼
[Final Compiled Exterior Prompt]
```

### Phase 1: Semantic Clash Prevention
The engine cleans up mutually exclusive selections to prevent catastrophic rendering conflicts:
1.  **Human Conflict**: If `human_presence` is set to `'no_humans'`, any active selections inside `human_activity` are deleted. Additionally, if the user selected figure-dependent motion blurs (`selective_motion_blur_on_figures` or `crowd_motion_blur`), they are wiped.
2.  **Vehicle Conflict**: If `vehicle` selections contain `'no_vehicles'`, the array is sanitized to only contain `['no_vehicles']` and any custom vehicle text is cleared. If the user selected `vehicle_motion_trail` in the motion system, it is safely deleted.

### Phase 2: Category-Aware Implicit Guidelines
To protect architectural integrity, the engine injects a strict **facade-preservation rule**:
*   *Injected String*: `with strict instruction to preserve the existing structural massing, original facade geometry, and original roofline, ensuring absolutely no architectural elements are altered, added, or removed, and explicitly preventing any structural elements from being replaced by surrounding landscaping, lush vegetation, or other environmental features`
*   *Semantic Role*: `geometry` (appended into the main subject sentence).

### Phase 3: Tilt-Shift Lens Default Perspective Correction
Professional exterior photography demands parallel vertical lines. The engine automatically injects:
*   If `camera_angle` is selected, it appends: `using a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`
*   If `camera_angle` is omitted, it injects a standalone camera directive: `captured with a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`

### Phase 4: Composition Framing Default Directive
To draw focus toward the main building facade, the engine injects out-of-focus framing rules at the corners:
*   *Injected String*: `utilizing soft, out-of-focus framing elements (such as clean architectural silhouettes, subtle structural borders, or distant organic elements) positioned strictly in the extreme corners of the frame, ensuring the main facade and architectural focal points remain 100% unobstructed, sharp, and clear`
*   *Integration*: Merges cleanly into the `composition` semantic block.

### Phase 5: High-fidelity Facade Material Resolution
Exterior facades feature glass and dense textures. The engine enhances material rendering:
*   If a material carriage is selected, it appends: `with realistic glass reflection, refraction, and enhanced micro-surface texture resolution`
*   If no material is selected, it injects a default material value: `featuring high-fidelity material representation, realistic glass reflection and refraction, and enhanced micro-surface texture resolution`

### Phase 6: Output & Post-Processing Specifications
Every prompt is appended with professional publishing metadata:
*   *Injected String*: `rendered at photorealistic ultra-high definition, with filmic clean post-processing and neutral 5500k color science, suitable for Archdaily publication`
*   *Semantic Role*: `output` (final compiled sentence).

---

## 4. UI Rendering & Interaction Flow (`App.jsx` & `LeftPanel.jsx`)

1.  **State Synchronization**: When `activeCategory` is set to `'exterior'`, the app instantly switches CSS classes and filters `promptSchema` down to carriages containing `categories: ['exterior']` or global carriages.
2.  **Display Filtering**:
    ```javascript
    const activeSchema = promptSchema.filter(
      item => !item.categories || item.categories.includes('exterior')
    );
    ```
    This reduces the system's massive master schema down to the 16 highly focused exterior parameters.
3.  **Local Storage**: All selections under the exterior tab are cached under keys `aprompt_selections` and `aprompt_customTexts`, meaning users can switch between Interior and Exterior tabs without losing their inputs.

---

## 5. Developer Guide: Modifying the Exterior System

### How to Add a New Facade Material Option
1.  Open [`src/data/schema.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/data/schema.js).
2.  Locate the carriage with `id: 'material'`.
3.  Add your new option into the `options` array:
    ```javascript
    { id: 'terracotta_tiles', label: 'Terracotta Tiles', value: 'terracotta cladding tiles' }
    ```
4.  Open English translation file [`src/translations/en.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/en.json) and add:
    ```json
    "option.terracotta_tiles": "Terracotta Tiles"
    ```
5.  Open Indonesian translation file [`src/translations/id.json`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/translations/id.json) and add:
    ```json
    "option.terracotta_tiles": "Ubin Terrakota"
    ```

### How to Adjust the Implicit Facade Geometry Preservation Rules
1.  Open [`src/engine/promptEngine.js`](file:///d:/Dokumen/SaaS%20with%20AI/aprompt/src/engine/promptEngine.js).
2.  Find the `else` block (default exterior block) for `geometryText` around line 87-90:
    ```javascript
    geometryText = 'with strict instruction to preserve the existing structural massing, original facade geometry...';
    ```
3.  Modify the literal string value to alter the default prompts generated across all exterior renderings.
