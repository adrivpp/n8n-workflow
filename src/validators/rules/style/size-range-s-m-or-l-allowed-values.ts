import { ValidationContext, ValidationResult, StyleRequest, MasterStyle } from '../../../types';

/**
 * Rule: size_range must be one of S, M or L
 * Entity: Style
 * Field: size_range
 * Severity: HARD
 * When: Update
 *
 * Description:
 * Validates that during a style update, the 'size_range' field is set to one of the
 * allowed values: 'S', 'M', or 'L'. This ensures consistency for apparel sizing
 * and prevents invalid size ranges from being saved in the system.
 */
export function validateSizeRangeSMorLAllowedValues(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  const existing = existingRecord as MasterStyle | null;

  const allowedSizeRanges = ['S', 'M', 'L'];

  // This rule applies only during an update.
  // If no existing record, it's a new style creation, and this rule does not apply.
  if (!existing) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'Rule applies only to style updates, skipping for new creation.',
        style_code: current.style_code,
        current_size_range: current.size_range,
      },
      ruleName: 'SizeRangeSMorLAllowedValues',
      fieldName: 'size_range',
      newValue: current.size_range,
    };
  }

  // If it's an update, check if the current size_range is one of the allowed values
  if (!allowedSizeRanges.includes(current.size_range)) {
    return {
      valid: false,
      message: `The 'size_range' value '${current.size_range}' is not allowed during update. It must be one of: ${allowedSizeRanges.join(', ')}.`, 
      severity,
      context: {
        allowed_values: allowedSizeRanges,
        style_code: current.style_code,
        current_size_range: current.size_range,
        previous_size_range: existing.size_range,
      },
      ruleName: 'SizeRangeSMorLAllowedValues',
      fieldName: 'size_range',
      oldValue: existing.size_range,
      newValue: current.size_range,
    };
  }

  // If the size_range is valid for an update
  return {
    valid: true,
    severity,
    context: {
      style_code: current.style_code,
      current_size_range: current.size_range,
      previous_size_range: existing.size_range,
    },
    ruleName: 'SizeRangeSMorLAllowedValues',
    fieldName: 'size_range',
    oldValue: existing.size_range,
    newValue: current.size_range,
  };
}
