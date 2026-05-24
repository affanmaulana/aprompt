// ============================================================================
// Aprompt — Semantic Prompt Assembly Engine
// Zero-latency Client-side Compiler
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
 * Compile selections and custom texts into a highly structured, professional architectural briefing
 * @param {Array} schema - The prompt carriage schema
 * @param {Object} selections - User option selections (carriageId -> optionId)
 * @param {Object} customTexts - User custom text inputs (carriageId -> customText)
 * @param {Array} sentenceConfig - Configuration for compiling groups of parts into sentences
 */
export function assemblePrompt(schema, selections, customTexts, sentenceConfig) {
  if (!schema || !Array.isArray(schema)) return '';
  
  // 1. Gather all active/resolved values for each carriage in order
  const resolvedValues = {};
  
  schema.forEach((item) => {
    const selectedId = selections?.[item.id];
    if (!selectedId) return; // Skip if no selection

    let valueToInject = '';

    if (selectedId === 'custom') {
      const rawText = customTexts?.[item.id] || '';
      valueToInject = sanitizeValue(rawText);
    } else {
      const option = item.options?.find(opt => opt.id === selectedId);
      if (option) {
        valueToInject = sanitizeValue(option.value);
      }
    }

    if (valueToInject) {
      // Replace [VALUE] in template, and sanitize spacing
      const resolvedTemplate = item.template.replace('[VALUE]', valueToInject).trim();
      resolvedValues[item.id] = {
        value: resolvedTemplate,
        semanticPart: item.semanticPart || 'subject', // Fall back dynamically injected ones to subject
        order: item.order || 99
      };
    }
  });

  // 2. Map sentence configurations
  const sentences = [];

  const config = sentenceConfig || [];

  config.forEach((sentenceDef) => {
    // Collect all resolved values belonging to the parts in this sentence
    const partsInSentence = [];
    
    // We sort the parts based on their schema order
    schema
      .filter(item => sentenceDef.parts.includes(item.semanticPart || 'subject'))
      .forEach(item => {
        if (resolvedValues[item.id]) {
          partsInSentence.push(resolvedValues[item.id]);
        }
      });

    if (partsInSentence.length === 0) return; // Skip empty sentences

    // Join all parts with the sentence's separator (e.g. ', ')
    const separator = sentenceDef.separator || ' ';
    const bodyText = partsInSentence
      .map(p => p.value)
      .join(separator)
      .trim();

    if (!bodyText) return;

    // Apply prefix and suffix
    const prefix = sentenceDef.prefix || '';
    let suffix = sentenceDef.suffix || '.';

    // Assemble sentence and clean up formatting
    let fullSentence = `${prefix}${bodyText}`;
    
    // Ensure it ends with exactly one dot or suffix
    fullSentence = fullSentence.trim().replace(/[.,;]+$/, '');
    fullSentence = `${fullSentence}${suffix}`;

    // Capitalize first character
    fullSentence = fullSentence.charAt(0).toUpperCase() + fullSentence.slice(1);

    sentences.push(fullSentence);
  });

  // 3. Handle any orphaned carriages (e.g., dynamically injected carriages whose semanticParts don't match any sentence config)
  const mappedSemanticParts = new Set(config.flatMap(c => c.parts));
  const orphans = [];

  schema.forEach(item => {
    if (resolvedValues[item.id]) {
      const partType = item.semanticPart || 'subject';
      if (!mappedSemanticParts.has(partType)) {
        orphans.push(resolvedValues[item.id]);
      }
    }
  });

  if (orphans.length > 0) {
    let orphanText = orphans.map(o => o.value).join(', ').trim().replace(/[.,;]+$/, '');
    if (orphanText) {
      orphanText = orphanText.charAt(0).toUpperCase() + orphanText.slice(1) + '.';
      sentences.push(orphanText);
    }
  }

  // 4. Join all sentences with a single space
  return sentences.join(' ').replace(/\s+/g, ' ').trim();
}
