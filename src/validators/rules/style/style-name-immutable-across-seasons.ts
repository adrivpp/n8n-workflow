/**
 * Rule: The `name` field cannot be changed if the `season_code` field has also changed from its previous historical value.
 * Entity: Style
 * Field: name
 * Severity: HARD
 * When: Update
 * 
 * Description:
 * Validates that the `name` field of a style cannot be changed if its `season_code` has also been updated.
 * This rule ensures consistency of style names across different seasons, preventing unintended re-branding
 * or confusion when a style is carried over or re-introduced under a new season code.
 */
export function validateStyleNameImmutableAcrossSeasons(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;
  
  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  const existing = existingRecord as MasterStyle | null;
  
  // If no existing record, this is a new style creation - always valid
  if (!existing) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'New style creation - no historical comparison needed',
        style_code: current.style_code,
      },
      ruleName: 'StyleNameImmutableAcrossSeasons',
      fieldName: 'name',
      newValue: current.name,
    };
  }
  
  // Check if the style name has changed
  const nameChanged = current.name !== existing.name;
  // Check if the season code has changed
  const seasonChanged = current.season_code !== existing.season_code;
  
  // Rule violation: name changed while transitioning seasons
  if (nameChanged && seasonChanged) {
    return {
      valid: false,
      message: `Style name cannot change between seasons. Previous name: "${existing.name}" (Season: ${existing.season_code}), Current name: "${current.name}" (Season: ${current.season_code}).`,
      severity,
      context: {
        previous_name: existing.name,
        current_name: current.name,
        previous_season: existing.season_code,
        current_season: current.season_code,
        style_code: current.style_code,
      },
      ruleName: 'StyleNameImmutableAcrossSeasons',
      fieldName: 'name',
      oldValue: existing.name,
      newValue: current.name,
    };
  }
  
  // Valid scenarios:
  // 1. Name unchanged (regardless of season change)
  // 2. Season unchanged (regardless of name change)
  return {
    valid: true,
    severity,
    context: {
      reason: nameChanged 
        ? 'Name changed, but season code remained the same (allowed)'
        : seasonChanged
          ? 'Season code changed, but name remained the same (allowed)'
          : 'Neither name nor season code changed',
      style_code: current.style_code,
      previous_name: existing.name,
      current_name: current.name,
      previous_season: existing.season_code,
      current_season: current.season_code,
    },
    ruleName: 'StyleNameImmutableAcrossSeasons',
    fieldName: 'name',
    oldValue: existing.name,
    newValue: current.name,
  };
}
