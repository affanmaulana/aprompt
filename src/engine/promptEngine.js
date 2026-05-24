// ============================================================================
// Aprompt — Semantic Prompt Assembly Engine (v2)
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
 */
export function assemblePrompt(schema, selections, customTexts, sentenceConfig) {
  if (!schema || !Array.isArray(schema)) return '';
  
  const resolvedValues = {};
  
  // 1. INJECT IMPLICIT CGI brief FOUNDATION (HIDDEN PRO DIRECTIVES)
  resolvedValues['role'] = {
    value: 'Act as a professional CGI director and architectural photographer',
    semanticPart: 'role'
  };

  resolvedValues['task'] = {
    value: 'Generate a stunning architectural visualization rendering',
    semanticPart: 'task'
  };

  // Implicit Geometry Preservation (Always Yes)
  resolvedValues['geometry'] = {
    value: 'with instruction to preserve existing structural massing, facade geometry, and original roofline',
    semanticPart: 'geometry'
  };

  // 2. PROCESS USER-CONFIGURED SPECIFICATIONS
  schema.forEach((item) => {
    const selection = selections?.[item.id];
    const customText = customTexts?.[item.id] || '';

    // If both selections and custom text are empty, skip entirely
    const hasSelection = selection !== undefined && selection !== null && selection !== '';
    const hasCustomText = customText.trim().length > 0;
    if (!hasSelection && !hasCustomText) return;

    // Special Case B: Materiality Multi-select + Custom text
    if (item.id === 'material') {
      const selectedIds = Array.isArray(selection) ? selection : [];
      const materialParts = [];

      // Collect standard options
      selectedIds.forEach((id) => {
        const opt = item.options?.find(o => o.id === id);
        if (opt && opt.value) {
          materialParts.push(opt.value);
        }
      });

      // Add custom manual input if present
      const cleanCustom = sanitizeValue(customText);
      if (cleanCustom) {
        materialParts.push(cleanCustom);
      }

      if (materialParts.length > 0) {
        const materialList = formatList(materialParts);
        resolvedValues['material'] = {
          value: `featuring high-fidelity representation of ${materialList} materiality`,
          semanticPart: 'material'
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
  const framingDirective = 'utilizing soft, out-of-focus framing elements (such as clean architectural silhouettes, subtle structural borders, or distant organic elements) positioned strictly in the extreme corners of the frame, ensuring the main facade remains 100% unobstructed, sharp, and clear';
  
  if (userComposition) {
    resolvedValues['composition'].value = `${userComposition}, while ${framingDirective}`;
  } else {
    resolvedValues['composition'] = {
      value: framingDirective,
      semanticPart: 'composition'
    };
  }

  // 4. INJECT IMPLICIT MATERIAL QUALITY DEFAULT DIRECTIVE
  // If the user selected materials, append glass reflection context to enrich details
  if (resolvedValues['material']) {
    resolvedValues['material'].value += ' with realistic glass reflection, refraction, and enhanced micro-surface texture resolution';
  } else {
    resolvedValues['material'] = {
      value: 'featuring high-fidelity material representation, realistic glass reflection and refraction, and enhanced micro-surface texture resolution',
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
