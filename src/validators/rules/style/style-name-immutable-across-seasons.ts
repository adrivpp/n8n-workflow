/**
 * Rule: Style name cannot change between seasons
 * Entity: Style
 * Field: name
 * Severity: SOFT
 * When: Update
 *
 * Description:
 * Validates that when a style is updated for a new season, the style name
 * remains consistent with the previous season. This ensures brand consistency
 * and prevents confusion in the product catalog.
 */

import {
  ValidationContext,
  ValidationResult,
  StyleRequest,
  MasterStyle,
} from '../../../types';

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
      },
      ruleName: 'StyleNameImmutableAcrossSeasons',
      fieldName: 'name',
      newValue: current.name,
    };
  }

  // Compare current name with historical name
  const nameChanged = current.name !== existing.name;
  const seasonChanged = current.season_code !== existing.season_code;

  // Rule violation: name changed while transitioning seasons
  if (nameChanged && seasonChanged) {
    return {
      valid: false,
      message: `Style name cannot change between seasons. Previous: "${existing.name}" (${existing.season_code}), Current: "${current.name}" (${current.season_code})`,
      severity,
      context: {
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

  // Valid: name unchanged or same season update
  return {
    valid: true,
    severity,
    context: {
      reason: nameChanged
        ? 'Same season update - name change allowed'
        : 'Name unchanged',
      season_code: current.season_code,
    },
    ruleName: 'StyleNameImmutableAcrossSeasons',
    fieldName: 'name',
    oldValue: existing.name,
    newValue: current.name,
  };
}
