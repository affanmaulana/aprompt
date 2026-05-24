// ============================================================================
// Aprompt — Architectural Specification Schema (v2)
// Minimalist Creative Parameters for Premium CGI Briefings
// ============================================================================

export const promptSchema = [
  // ========================================================================
  // GROUP: essentials — Essentials
  // ========================================================================
  {
    id: 'subject',
    title: 'Subject Description',
    category: 'project',
    group: 'essentials',
    order: 1,
    priority: 'required',
    template: '[VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'subject',
    allowDetailInput: true,
    options: [
      { id: 'residential_house', label: 'Residential House', value: 'Residential House' },
      { id: 'luxury_villa', label: 'Luxury Villa', value: 'Luxury Villa' },
      { id: 'townhouse', label: 'Townhouse', value: 'Townhouse' },
      { id: 'clubhouse', label: 'Clubhouse', value: 'Clubhouse' },
      { id: 'office_tower', label: 'Office Tower', value: 'Office Tower' },
      { id: 'airport', label: 'Airport', value: 'Airport' },
      { id: 'museum', label: 'Museum', value: 'Museum' },
      { id: 'hospital', label: 'Hospital', value: 'Hospital' },
      { id: 'mixed_use_complex', label: 'Mixed-Use Complex', value: 'Mixed-Use Complex' },
      { id: 'school', label: 'School', value: 'School' },
    ],
  },
  {
    id: 'arch_style',
    title: 'Architectural Style',
    category: 'project',
    group: 'essentials',
    order: 2,
    priority: 'required',
    template: 'in [VALUE] style',
    enabled: true,
    expandable: true,
    semanticPart: 'subject',
    allowDetailInput: true,
    options: [
      { id: 'minimalist', label: 'Minimalist', value: 'Minimalist' },
      { id: 'modern_tropical', label: 'Modern Tropical', value: 'Modern Tropical' },
      { id: 'contemporary', label: 'Contemporary', value: 'Contemporary' },
      { id: 'brutalist', label: 'Brutalist', value: 'Brutalist' },
      { id: 'industrial', label: 'Industrial', value: 'Industrial' },
      { id: 'neo_classical', label: 'Neo Classical', value: 'Neo Classical' },
      { id: 'art_deco', label: 'Art Deco', value: 'Art Deco' },
      { id: 'scandinavian', label: 'Scandinavian', value: 'Scandinavian' },
      { id: 'japandi', label: 'Japandi', value: 'Japandi' },
      { id: 'neo_futurism', label: 'Neo Futurism', value: 'Neo Futurism' },
    ],
  },
  {
    id: 'material',
    title: 'Materiality & Finishes',
    category: 'project',
    group: 'essentials',
    order: 3,
    priority: 'required',
    template: 'featuring [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'material',
    type: 'multi-select',
    options: [
      { id: 'exposed_concrete', label: 'Concrete', value: 'exposed concrete' },
      { id: 'natural_stone', label: 'Natural Stone', value: 'natural stone' },
      { id: 'red_brick', label: 'Red Brick', value: 'red brick' },
      { id: 'warm_timber', label: 'Timber', value: 'warm timber' },
      { id: 'black_steel', label: 'Black Steel', value: 'black steel' },
      { id: 'white_plaster', label: 'Plaster', value: 'white plaster' },
      { id: 'corten_steel', label: 'Corten Steel', value: 'corten steel' },
      { id: 'bamboo', label: 'Bamboo', value: 'bamboo' },
    ],
  },

  // ========================================================================
  // GROUP: camera — Camera & Framing
  // ========================================================================
  {
    id: 'camera_angle',
    title: 'Camera Angle',
    category: 'camera',
    group: 'camera',
    order: 10,
    priority: 'required',
    template: 'captured from [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'camera',
    allowDetailInput: true,
    options: [
      { id: 'eye_level', label: 'Eye Level', value: 'Eye Level' },
      { id: 'low_angle', label: 'Low Angle', value: 'Low Angle' },
      { id: 'high_angle', label: 'High Angle', value: 'High Angle' },
      { id: 'bird_eye_view', label: 'Bird Eye View', value: 'Bird Eye View' },
      { id: 'drone_perspective', label: 'Drone Perspective', value: 'Drone Perspective' },
      { id: 'street_perspective', label: 'Street Perspective', value: 'Street Perspective' },
    ],
  },
  {
    id: 'composition',
    title: 'Composition Control',
    category: 'camera',
    group: 'camera',
    order: 11,
    priority: 'optional',
    template: 'emphasizing [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'composition',
    options: [
      { id: 'negative_space', label: 'Negative Space', value: 'Negative Space' },
      { id: 'dominant_sky_ratio', label: 'Dominant Sky Ratio', value: 'Dominant Sky Ratio' },
      { id: 'strong_foreground', label: 'Strong Foreground', value: 'Strong Foreground' },
      { id: 'building_dominance', label: 'Building Dominance', value: 'Building Dominance' },
      { id: 'visual_hierarchy', label: 'Visual Hierarchy', value: 'Visual Hierarchy' },
      { id: 'leading_lines', label: 'Leading Lines', value: 'Leading Lines' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },

  // ========================================================================
  // GROUP: environment — Environment & Context
  // ========================================================================
  {
    id: 'lighting',
    title: 'Lighting',
    category: 'environment',
    group: 'environment',
    order: 20,
    priority: 'required',
    template: 'illuminated by [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'lighting',
    allowDetailInput: true,
    options: [
      { id: 'golden_hour', label: 'Golden Hour', value: 'Golden Hour' },
      { id: 'blue_hour', label: 'Blue Hour', value: 'Blue Hour' },
      { id: 'overcast_soft_light', label: 'Overcast Soft Light', value: 'Overcast Soft Light' },
      { id: 'morning_light', label: 'Morning Light', value: 'Morning Light' },
      { id: 'noon_sun', label: 'Noon Sun', value: 'Noon Sun' },
      { id: 'afternoon_sun', label: 'Afternoon Sun', value: 'Afternoon Sun' },
      { id: 'sunset_glow', label: 'Sunset Glow', value: 'Sunset Glow' },
      { id: 'cloudy_day_diffusion', label: 'Cloudy Day Diffusion', value: 'Cloudy Day Diffusion' },
      { id: 'storm_light', label: 'Storm Light', value: 'Storm Light' },
      { id: 'volumetric_god_rays', label: 'Volumetric God Rays', value: 'Volumetric God Rays' },
    ],
  },
  {
    id: 'weather',
    title: 'Weather Conditions',
    category: 'environment',
    group: 'environment',
    order: 21,
    priority: 'recommended',
    template: 'under [VALUE] conditions',
    enabled: true,
    expandable: true,
    semanticPart: 'atmosphere',
    allowDetailInput: true,
    options: [
      { id: 'sunny_clear_sky', label: 'Sunny Clear Sky', value: 'Sunny Clear Sky' },
      { id: 'partly_cloudy', label: 'Partly Cloudy', value: 'Partly Cloudy' },
      { id: 'dense_fog', label: 'Dense Fog', value: 'Dense Fog' },
      { id: 'gentle_mist', label: 'Gentle Mist', value: 'Gentle Mist' },
      { id: 'light_rain', label: 'Light Rain', value: 'Light Rain' },
      { id: 'heavy_monsoon_rain', label: 'Heavy Monsoon Rain', value: 'Heavy Monsoon Rain' },
      { id: 'tropical_humidity', label: 'Tropical Humidity', value: 'Tropical Humidity' },
      { id: 'dry_arid_climate', label: 'Dry Arid Climate', value: 'Dry Arid Climate' },
      { id: 'dust_storm', label: 'Dust Storm', value: 'Dust Storm' },
      { id: 'light_snowfall', label: 'Light Snowfall', value: 'Light Snowfall' },
    ],
  },
  {
    id: 'atmosphere',
    title: 'Atmosphere & Mood',
    category: 'environment',
    group: 'environment',
    order: 22,
    priority: 'recommended',
    template: 'set in a [VALUE] atmosphere',
    enabled: true,
    expandable: true,
    semanticPart: 'atmosphere',
    options: [
      { id: 'tropical_lush', label: 'Tropical Lush', value: 'Tropical Lush' },
      { id: 'mediterranean_warm', label: 'Mediterranean Warm', value: 'Mediterranean Warm' },
      { id: 'dense_urban', label: 'Dense Urban', value: 'Dense Urban' },
      { id: 'serene_coastal', label: 'Serene Coastal', value: 'Serene Coastal' },
      { id: 'alpine_mountain', label: 'Alpine Mountain', value: 'Alpine Mountain' },
      { id: 'forest_retreat', label: 'Forest Retreat', value: 'Forest Retreat' },
      { id: 'desert_minimal', label: 'Desert Minimal', value: 'Desert Minimal' },
      { id: 'suburban_calm', label: 'Suburban Calm', value: 'Suburban Calm' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
  {
    id: 'geo_context',
    title: 'Geographical Context',
    category: 'environment',
    group: 'environment',
    order: 23,
    priority: 'optional',
    template: 'located in [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'context',
    options: [
      { id: 'bekasi', label: 'Bekasi', value: 'Bekasi' },
      { id: 'jakarta', label: 'Jakarta', value: 'Jakarta' },
      { id: 'bandung', label: 'Bandung', value: 'Bandung' },
      { id: 'bali', label: 'Bali', value: 'Bali' },
      { id: 'singapore', label: 'Singapore', value: 'Singapore' },
      { id: 'tokyo', label: 'Tokyo', value: 'Tokyo' },
      { id: 'new_york', label: 'New York', value: 'New York' },
      { id: 'dubai', label: 'Dubai', value: 'Dubai' },
      { id: 'london', label: 'London', value: 'London' },
      { id: 'sydney', label: 'Sydney', value: 'Sydney' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
  {
    id: 'landscape',
    title: 'Landscape Strategy',
    category: 'environment',
    group: 'environment',
    order: 24,
    priority: 'recommended',
    template: 'surrounded by [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'context',
    allowDetailInput: true,
    options: [
      { id: 'minimal_landscape', label: 'Minimal Landscape', value: 'Minimal Landscape' },
      { id: 'lush_tropical_garden', label: 'Lush Tropical Garden', value: 'Lush Tropical Garden' },
      { id: 'manicured_formal_garden', label: 'Manicured Formal Garden', value: 'Manicured Formal Garden' },
      { id: 'urban_streetscape', label: 'Urban Streetscape', value: 'Urban Streetscape' },
      { id: 'pocket_garden', label: 'Pocket Garden', value: 'Pocket Garden' },
      { id: 'water_feature_landscape', label: 'Water Feature Landscape', value: 'Water Feature Landscape' },
    ],
  },
  {
    id: 'street',
    title: 'Street Context',
    category: 'environment',
    group: 'environment',
    order: 25,
    priority: 'optional',
    template: 'fronting a [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'context',
    options: [
      { id: 'smooth_asphalt_road', label: 'Smooth Asphalt Road', value: 'Smooth Asphalt Road' },
      { id: 'concrete_paved_road', label: 'Concrete Paved Road', value: 'Concrete Paved Road' },
      { id: 'paving_block_surface', label: 'Paving Block Surface', value: 'Paving Block Surface' },
      { id: 'shared_pedestrian_street', label: 'Shared Pedestrian Street', value: 'Shared Pedestrian Street' },
      { id: 'urban_boulevard', label: 'Urban Boulevard', value: 'Urban Boulevard' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },

  // ========================================================================
  // GROUP: narrative — People & Storytelling
  // ========================================================================
  {
    id: 'vehicle',
    title: 'Vehicle Context',
    category: 'narrative',
    group: 'narrative',
    order: 30,
    priority: 'optional',
    template: 'with [VALUE] present',
    enabled: true,
    expandable: true,
    semanticPart: 'narrative',
    options: [
      { id: 'luxury_sedans', label: 'Luxury Sedans', value: 'Luxury Sedans' },
      { id: 'family_suvs', label: 'Family SUVs', value: 'Family SUVs' },
      { id: 'electric_vehicles', label: 'Electric Vehicles', value: 'Electric Vehicles' },
      { id: 'motorcycles', label: 'Motorcycles', value: 'Motorcycles' },
      { id: 'public_transport', label: 'Public Transport', value: 'Public Transport' },
      { id: 'no_vehicles', label: 'No Vehicles', value: 'No Vehicles' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
  {
    id: 'human_presence',
    title: 'Human Presence',
    category: 'narrative',
    group: 'narrative',
    order: 31,
    priority: 'recommended',
    template: 'populated with [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'narrative',
    allowDetailInput: true,
    options: [
      { id: 'no_humans', label: 'No Humans', value: 'No Humans' },
      { id: 'few_scattered_figures', label: 'Few Scattered Figures', value: 'Few Scattered Figures' },
      { id: 'moderate_crowd', label: 'Moderate Crowd', value: 'Moderate Crowd' },
      { id: 'busy_urban_crowd', label: 'Busy Urban Crowd', value: 'Busy Urban Crowd' },
    ],
  },
  {
    id: 'human_activity',
    title: 'Human Activity',
    category: 'narrative',
    group: 'narrative',
    order: 32,
    priority: 'optional',
    template: 'engaged in [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'narrative',
    options: [
      { id: 'casual_walking', label: 'Casual Walking', value: 'Casual Walking' },
      { id: 'cycling', label: 'Cycling', value: 'Cycling' },
      { id: 'conversing', label: 'Conversing', value: 'Conversing' },
      { id: 'waiting', label: 'Waiting', value: 'Waiting' },
      { id: 'window_shopping', label: 'Window Shopping', value: 'Window Shopping' },
      { id: 'family_activities', label: 'Family Activities', value: 'Family Activities' },
      { id: 'jogging', label: 'Jogging', value: 'Jogging' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
  {
    id: 'motion',
    title: 'Motion System',
    category: 'narrative',
    group: 'narrative',
    order: 33,
    priority: 'optional',
    template: 'with [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'narrative',
    options: [
      { id: 'no_motion_blur', label: 'No Motion Blur', value: 'No Motion Blur' },
      { id: 'selective_motion_blur_on_figures', label: 'Selective Motion Blur on Figures', value: 'Selective Motion Blur on Figures' },
      { id: 'cinematic_motion_blur', label: 'Cinematic Motion Blur', value: 'Cinematic Motion Blur' },
      { id: 'crowd_motion_blur', label: 'Crowd Motion Blur', value: 'Crowd Motion Blur' },
      { id: 'vehicle_motion_trail', label: 'Vehicle Motion Trail', value: 'Vehicle Motion Trail' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
  {
    id: 'storytelling',
    title: 'Storytelling Context',
    category: 'narrative',
    group: 'narrative',
    order: 34,
    priority: 'optional',
    template: 'evoking a mood of [VALUE]',
    enabled: true,
    expandable: true,
    semanticPart: 'narrative',
    options: [
      { id: 'quiet_residential_life', label: 'Quiet Residential Life', value: 'Quiet Residential Life' },
      { id: 'weekend_leisure', label: 'Weekend Leisure', value: 'Weekend Leisure' },
      { id: 'business_district_energy', label: 'Business District Energy', value: 'Business District Energy' },
      { id: 'community_gathering', label: 'Community Gathering', value: 'Community Gathering' },
      { id: 'luxury_lifestyle', label: 'Luxury Lifestyle', value: 'Luxury Lifestyle' },
      { id: 'morning_commute', label: 'Morning Commute', value: 'Morning Commute' },
      { id: 'custom', label: 'Custom Input...', value: 'custom' },
    ],
  },
];

// ============================================================================
// Section Groups (Left Sidebar Navigation Map)
// ============================================================================

export const carriageGroups = [
  { id: 'essentials', title: 'Essentials', icon: 'Sparkles', order: 1 },
  { id: 'camera', title: 'Camera & Framing', icon: 'Camera', order: 2 },
  { id: 'environment', title: 'Environment', icon: 'Sun', order: 3 },
  { id: 'narrative', title: 'Narrative & Context', icon: 'Users', order: 4 },
];

// ============================================================================
// Helpers
// ============================================================================

export function getCarriagesByGroup(groupId) {
  return promptSchema.filter(c => c.group === groupId).sort((a, b) => a.order - b.order);
}

// ============================================================================
// Semantic Prompt Assembly Configurations (Aprompt v2)
// ============================================================================

export const semanticOrder = [
  'role',
  'task',
  'subject',
  'context',
  'camera',
  'geometry',
  'composition',
  'lighting',
  'material',
  'atmosphere',
  'narrative',
  'rendering',
  'output'
];

export const promptSentenceConfig = [
  {
    id: 'role_sentence',
    parts: ['role'],
    separator: ' ',
    prefix: '',
    suffix: '.'
  },
  {
    id: 'subject_sentence',
    parts: ['task', 'subject', 'geometry', 'material', 'context'],
    separator: ', ',
    prefix: '',
    suffix: '.'
  },
  {
    id: 'camera_sentence',
    parts: ['camera', 'composition'],
    separator: ', ',
    prefix: 'The shot is ',
    suffix: '.'
  },
  {
    id: 'environment_sentence',
    parts: ['lighting', 'atmosphere'],
    separator: ', ',
    prefix: 'The scene is ',
    suffix: '.'
  },
  {
    id: 'narrative_sentence',
    parts: ['narrative'],
    separator: ', ',
    prefix: 'It is ',
    suffix: '.'
  },
  {
    id: 'rendering_sentence',
    parts: ['rendering', 'output'],
    separator: ', ',
    prefix: 'The image is ',
    suffix: '.'
  }
];
