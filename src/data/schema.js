export const promptSchema = [
  {
    id: "source",
    title: "1. Source Context",
    template: "Based on the provided [VALUE], ",
    options: [
      { id: "sketchup", label: "Sketchup Raw Render", value: "raw 3D Sketchup clay render" },
      { id: "hand_sketch", label: "Hand Sketch", value: "hand-drawn architectural ink sketch" },
      { id: "autocad", label: "AutoCAD Linework", value: "technical AutoCAD linework drawing" },
      { id: "base_photo", label: "Base Site Photo", value: "base site photograph" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "style",
    title: "2. Architectural Style",
    template: "generate a [VALUE] ",
    options: [
      { id: "brutalist", label: "Brutalist", value: "brutalist" },
      { id: "tropical", label: "Tropical Contemporary", value: "tropical contemporary" },
      { id: "minimalist", label: "Minimalist Neoclassical", value: "minimalist neoclassical" },
      { id: "parametric", label: "Parametric", value: "parametric" },
      { id: "midcentury", label: "Mid-Century Modern", value: "mid-century modern" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "typology",
    title: "3. Building Typology",
    template: "architectural visualization of a [VALUE], ",
    options: [
      { id: "highrise", label: "High-Rise Tower", value: "high-rise residential tower" },
      { id: "shophouse", label: "Commercial Shophouse", value: "commercial shophouse complex" },
      { id: "healthcare", label: "Healthcare Facility", value: "healthcare facility" },
      { id: "pavilion", label: "Minimalist Pavilion", value: "minimalist pavilion" },
      { id: "museum", label: "Cultural Museum", value: "cultural museum" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "camera",
    title: "4. Camera Angle",
    template: "shot from a [VALUE]. ",
    options: [
      { id: "eye_level", label: "Eye-Level Street", value: "dramatic eye-level street perspective" },
      { id: "aerial", label: "Aerial Bird's Eye", value: "sweeping aerial bird's-eye view" },
      { id: "worm", label: "Worm's Eye", value: "heroic worm's-eye low angle" },
      { id: "interior", label: "Interior Wide", value: "spacious interior wide shot" },
      { id: "facade", label: "Facade Detail", value: "close-up facade detail shot" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "material",
    title: "5. Materiality & Texture",
    template: "The structure features rich materiality, specifically [VALUE], ",
    options: [
      { id: "concrete_glass", label: "Concrete & Glass", value: "exposed raw concrete and large low-E glass panels" },
      { id: "timber_steel", label: "Timber & Steel", value: "warm timber cladding intersecting with black structural steel" },
      { id: "rammed_earth", label: "Rammed Earth & Stone", value: "textured rammed earth walls and natural stone paving" },
      { id: "brickwork", label: "Classic Brickwork", value: "classic red brickwork with modern black window mullions" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "environment",
    title: "6. Environment & Atmosphere",
    template: "captured during a [VALUE] ",
    options: [
      { id: "golden", label: "Golden Hour", value: "warm golden hour with long shadows" },
      { id: "overcast", label: "Moody Overcast", value: "moody overcast morning with soft diffused light" },
      { id: "blue_hour", label: "Cinematic Blue Hour", value: "cinematic blue hour twilight" },
      { id: "midday", label: "Bright Midday", value: "bright clear midday with harsh directional sunlight" },
      { id: "cyberpunk", label: "Cyberpunk Night", value: "vibrant cyberpunk night illuminated by neon lights" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "context",
    title: "7. Surrounding Context",
    template: "set against a [VALUE]. ",
    options: [
      { id: "urban", label: "Dense Urban", value: "dense urban metropolis background" },
      { id: "tropical_forest", label: "Lush Tropical", value: "lush tropical landscaping with monstera and palm trees" },
      { id: "desert", label: "Arid Desert", value: "minimalist arid desert environment" },
      { id: "coastal", label: "Coastal Waterfront", value: "serene coastal waterfront" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "human_scale",
    title: "8. Human/Activity Scale",
    template: "The scene is [VALUE], adding scale and life. ",
    options: [
      { id: "bustling", label: "Bustling Crowd", value: "bustling with pedestrians and vehicles" },
      { id: "solitary", label: "Solitary Figure", value: "anchored by a solitary figure in the foreground" },
      { id: "empty", label: "Empty & Serene", value: "completely empty and serene" },
      { id: "traffic", label: "Traffic Trails", value: "dynamic with blurred traffic light trails" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  },
  {
    id: "rendering",
    title: "9. Rendering Engine & Vibe",
    template: "Rendered in [VALUE].",
    options: [
      { id: "ue5", label: "Unreal Engine 5", value: "Unreal Engine 5 photorealism with global illumination" },
      { id: "vray", label: "V-Ray Crisp", value: "crisp V-Ray architectural style with hyper-realistic textures" },
      { id: "watercolor", label: "Watercolor Sketch", value: "an artistic architectural watercolor sketch style" },
      { id: "clay", label: "Physical Clay Model", value: "the style of a physical architectural macro clay model" },
      { id: "custom", label: "Ketik Sendiri...", value: "custom" }
    ]
  }
];
