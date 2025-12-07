import { ValidationContext, ValidationResult, StyleRequest, MasterStyle } from '../../../types';

/**
 * Rule: Style name cannot be changed after creation
 * Entity: Style
 * Field: name
 * Severity: HARD
 * When: Update
 *
 * Description:
 * This rule ensures that the 'name' field of a Style record remains immutable
 * once the style has been initially created. Any attempt to modify the style name
 * on an existing record will result in a hard validation error, maintaining data
 * integrity and consistency across the product catalog.
 */
export function validateStyleNameImmutableAfterCreation(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  const existing = existingRecord as MasterStyle | null;

  // If no existing record, this is a new style creation - always valid for this rule.
  // The 'name' is being set for the first time.
  if (!existing) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'New style creation - name is being set for the first time.',
        style_code: current.style_code,
      },
      ruleName: 'StyleNameImmutableAfterCreation',
      fieldName: 'name',
      newValue: current.name,
    };
  }

  // Prepare names for comparison, handling null/undefined and trimming whitespace
  const currentName = current.name ? String(current.name).trim() : '';
  const existingName = existing.name ? String(existing.name).trim() : '';

  // Rule violation: name has changed on an existing record
  if (currentName !== existingName) {
    return {
      valid: false,
      message: `Style name cannot be changed after creation. Previous: "${existing.name ?? 'null'}", Current: "${current.name ?? 'null'}".`,
      severity,
      context: {
        style_code: current.style_code,
        previous_name: existing.name,
        current_name: current.name,
      },
      ruleName: 'StyleNameImmutableAfterCreation',
      fieldName: 'name',
      oldValue: existing.name,
      newValue: current.name,
    };
  }

  // Valid: name has not changed (or only whitespace changed, which is ignored)
  return {
    valid: true,
    severity,
    context: {
      reason: 'Style name remains unchanged (or only whitespace adjusted).',
      style_code: current.style_code,
    },
    ruleName: 'StyleNameImmutableAfterCreation',
    fieldName: 'name',
    oldValue: existing.name,
    newValue: current.name,
  };
}
