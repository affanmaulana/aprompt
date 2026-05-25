// ============================================================================
// Aprompt — Semantic Prompt Assembly Engine (v3 - Category-Aware Briefing Compiler)
// Zero-latency CGI briefing Compiler with Implicit Foundation
// ============================================================================

/**
 * Clean up a manual string input by removing trailing punctuation (.,;) and collapsing spaces
 */
export function sanitizeValue(value) {
  if (!value) return '';
  return value
    .trim()
    .replace(/[.,;]+$/, '') // Remove trailing dots, commas, semicolons
    .replace(/\s+/g, ' ');   // Collapse multiple spaces to one
}

/**
 * Compile a grammatically correct English list from an array of strings (e.g. "A, B, and C")
 */
export function formatList(items) {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  return `${otherItems}, and ${lastItem}`;
}

/**
 * Compile selections and custom texts into a highly structured, professional architectural briefing
 * @param {Array} schema - The prompt carriage schema
 * @param {Object} selections - User option selections (carriageId -> optionId/Array/Boolean)
 * @param {Object} customTexts - User custom text inputs (carriageId -> customText)
 * @param {Array} sentenceConfig - Configuration for compiling groups of parts into sentences
 * @param {String} activeCategory - Active render category ('exterior' | 'interior' | 'cityscape')
 */
export function assemblePrompt(schema, selections, customTexts, sentenceConfig, activeCategory = 'exterior') {
  if (!schema || !Array.isArray(schema)) return '';

  const localSelections = selections ? { ...selections } : {};
  const localCustomTexts = customTexts ? { ...customTexts } : {};

  // 0. SEMANTIC CLASH CLEANUP (Engine-level safety)
  if (localSelections['human_presence'] === 'no_humans') {
    delete localSelections['human_activity'];
    delete localCustomTexts['human_activity'];
    if (localSelections['motion'] === 'selective_motion_blur_on_figures' || localSelections['motion'] === 'crowd_motion_blur') {
      delete localSelections['motion'];
    }
  }

  const selectedVehicle = localSelections['vehicle'];
  if (Array.isArray(selectedVehicle) && selectedVehicle.includes('no_vehicles')) {
    localSelections['vehicle'] = ['no_vehicles'];
    delete localCustomTexts['vehicle'];
    if (localSelections['motion'] === 'vehicle_motion_trail') {
      delete localSelections['motion'];
    }
  }
  
  const resolvedValues = {};
  
  // 1. INJECT IMPLICIT CGI brief FOUNDATION (HIDDEN PRO DIRECTIVES)
  resolvedValues['role'] = {
    value: 'Act as a professional CGI director and architectural photographer specializing in high-fidelity architectural preservation',
    semanticPart: 'role'
  };

  const taskText = activeCategory === 'interior'
    ? 'Generate a stunning, accurate interior design architectural visualization rendering'
    : activeCategory === 'cityscape'
      ? 'Generate a stunning, accurate cityscape and urban design architectural visualization rendering'
      : 'Generate a stunning, accurate architectural visualization rendering';

  resolvedValues['task'] = {
    value: taskText,
    semanticPart: 'task'
  };

  // Implicit Geometry Preservation (Always Yes - Category Aware)
  let geometryText;
  if (activeCategory === 'interior') {
    geometryText = 'with strict instruction to preserve the interior room structure, original wall layouts, ceiling height, and window placements, ensuring absolutely no architectural elements are altered, added, or removed, and explicitly preventing any furniture elements from distorting the spatial bounds of the architecture';
  } else if (activeCategory === 'cityscape') {
    geometryText = 'with strict instruction to preserve the existing urban morphology, skyline silhouette, block layouts, and street grids, ensuring absolutely no architectural or infrastructural elements are altered or distorted, and explicitly preventing any structures from being replaced by erratic landscape features';
  } else {
    // default: exterior
    geometryText = 'with strict instruction to preserve the existing structural massing, original facade geometry, and original roofline, ensuring absolutely no architectural elements are altered, added, or removed, and explicitly preventing any structural elements from being replaced by surrounding landscaping, lush vegetation, or other environmental features';
  }

  resolvedValues['geometry'] = {
    value: geometryText,
    semanticPart: 'geometry'
  };

  // 2. PROCESS USER-CONFIGURED SPECIFICATIONS
  schema.forEach((item) => {
    const selection = localSelections[item.id];
    const customText = localCustomTexts[item.id] || '';

    // If both selections and custom text are empty, skip entirely
    const hasSelection = selection !== undefined && selection !== null && selection !== '';
    const hasCustomText = customText.trim().length > 0;
    if (!hasSelection && !hasCustomText) return;

    // Generic Multi-select compilation
    if (item.type === 'multi-select') {
      const selectedIds = Array.isArray(selection) ? selection : [];
      const parts = [];

      selectedIds.forEach((id) => {
        const opt = item.options?.find(o => o.id === id);
        if (opt && opt.value) {
          parts.push(opt.value);
        }
      });

      const cleanCustom = sanitizeValue(customText);
      if (cleanCustom) {
        parts.push(cleanCustom);
      }

      if (parts.length > 0) {
        const listText = formatList(parts);
        const template = item.template || '[VALUE]';
        let resolvedTemplate = template.replace('[VALUE]', listText).trim();
        
        // Keep legacy special materiality formatting for backward compatibility
        if (item.id === 'material') {
          resolvedTemplate = `featuring high-fidelity representation of ${listText} materiality`;
        } else if (item.id === 'interior_material') {
          resolvedTemplate = `featuring high-fidelity representation of ${listText} interior finishes`;
        }

        resolvedValues[item.id] = {
          value: resolvedTemplate,
          semanticPart: item.semanticPart || 'subject'
        };
      }
      return;
    }

    // Standard single-select Inputs with custom details allowed
    let valueToInject = '';

    if (item.allowDetailInput) {
      const option = item.options?.find(opt => opt.id === selection);
      const selectedOptionVal = option ? sanitizeValue(option.value) : '';
      const cleanCustomText = sanitizeValue(customText);

      // Join option value and custom text cleanly
      const parts = [selectedOptionVal, cleanCustomText].filter(Boolean);
      valueToInject = parts.join(', ');
    } else {
      // Classic Custom Option Pill fallback or standard single select
      if (selection === 'custom') {
        valueToInject = sanitizeValue(customText);
      } else if (typeof selection === 'string') {
        const option = item.options?.find(opt => opt.id === selection);
        if (option) {
          valueToInject = sanitizeValue(option.value);
        }
      }
    }

    if (valueToInject) {
      const resolvedTemplate = item.template.replace('[VALUE]', valueToInject).trim();
      resolvedValues[item.id] = {
        value: resolvedTemplate,
        semanticPart: item.semanticPart || 'subject'
      };
    }
  });

  // 3. INJECT CAMERA LENS DEFAULT DIRECTIVE (Implicit Perspective Control)
  const userCamera = resolvedValues['camera_angle']?.value || '';
  if (userCamera) {
    resolvedValues['camera_angle'].value = `${userCamera} using a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion`;
  } else {
    // If no camera angle selected, inject the implicit perspective control as a standalone camera parameter
    resolvedValues['camera_angle'] = {
      value: 'captured with a high-end tilt-shift lens to ensure perfect vertical correction, parallel vertical lines, and no keystone distortion',
      semanticPart: 'camera'
    };
  }

  // 3.5. INJECT IMPLICIT COMPOSITION / FRAMING DEFAULT DIRECTIVE
  const userComposition = resolvedValues['composition']?.value || '';
  let framingDirective;
  
  if (activeCategory === 'interior') {
    framingDirective = 'utilizing clean, balanced framing lines (such as subtle structural walls or columns strictly at the edge of the frame) positioned strictly in the extreme corners of the frame, ensuring the main interior space remains 100% unobstructed, sharp, clear, and visually balanced';
  } else {
    framingDirective = 'utilizing soft, out-of-focus framing elements (such as clean architectural silhouettes, subtle structural borders, or distant organic elements) positioned strictly in the extreme corners of the frame, ensuring the main facade and architectural focal points remain 100% unobstructed, sharp, and clear';
  }
  
  if (userComposition) {
    resolvedValues['composition'].value = `${userComposition}, while ${framingDirective}`;
  } else {
    resolvedValues['composition'] = {
      value: framingDirective,
      semanticPart: 'composition'
    };
  }

  // 4. INJECT IMPLICIT MATERIAL QUALITY DEFAULT DIRECTIVE
  const activeMaterialKey = activeCategory === 'interior' ? 'interior_material' : 'material';
  
  if (resolvedValues[activeMaterialKey]) {
    if (activeCategory === 'interior') {
      resolvedValues[activeMaterialKey].value += ' with realistic wood grain patterns, high-fidelity stone veining, fabric weave textures, and physically accurate light scattering and reflection';
    } else {
      resolvedValues[activeMaterialKey].value += ' with realistic glass reflection, refraction, and enhanced micro-surface texture resolution';
    }
  } else {
    const defaultMaterialValue = activeCategory === 'interior'
      ? 'featuring high-fidelity interior material representation, realistic wood grain patterns, stone veining, fabric weaves, and physically accurate light scattering'
      : 'featuring high-fidelity material representation, realistic glass reflection and refraction, and enhanced micro-surface texture resolution';
      
    resolvedValues[activeMaterialKey] = {
      value: defaultMaterialValue,
      semanticPart: 'material'
    };
  }

  // 5. INJECT IMPLICIT OUTPUT & POST-PROCESSING DEFAULT DIRECTIVE
  resolvedValues['output'] = {
    value: 'rendered at photorealistic ultra-high definition, with filmic clean post-processing and neutral 5500k color science, suitable for Archdaily publication',
    semanticPart: 'output'
  };

  // 6. ASSEMBLE SENTENCES
  const sentences = [];
  const config = sentenceConfig || [];

  config.forEach((sentenceDef) => {
    const partsInSentence = [];
    
    // Maintain chronological sorting based on schema definition
    schema.forEach(item => {
      if (resolvedValues[item.id] && sentenceDef.parts.includes(item.semanticPart || 'subject')) {
        partsInSentence.push(resolvedValues[item.id]);
      }
    });

    // Also include implicit values that don't map directly to schema keys but are in resolvedValues (e.g. role, task, output, geometry)
    sentenceDef.parts.forEach(part => {
      Object.keys(resolvedValues).forEach(key => {
        const isImplicit = !schema.some(s => s.id === key);
        if (isImplicit && resolvedValues[key].semanticPart === part) {
          partsInSentence.push(resolvedValues[key]);
        }
      });
    });

    if (partsInSentence.length === 0) return;

    const separator = sentenceDef.separator || ' ';
    const bodyText = partsInSentence
      .map(p => p.value)
      .join(separator)
      .trim();

    if (!bodyText) return;

    const prefix = sentenceDef.prefix || '';
    const suffix = sentenceDef.suffix || '.';

    let fullSentence = `${prefix}${bodyText}`;
    fullSentence = fullSentence.trim().replace(/[.,;]+$/, '');
    fullSentence = `${fullSentence}${suffix}`;

    // Capitalize first character
    fullSentence = fullSentence.charAt(0).toUpperCase() + fullSentence.slice(1);

    sentences.push(fullSentence);
  });

  return sentences.join(' ').replace(/\s+/g, ' ').trim();
}
