/**
 * Rule: size_range should be one of s, m.
 * Entity: Style
 * Field: size_range
 * Severity: HARD
 * When: Both
 *
 * Description:
 * Validates that the 'size_range' field for a style request is restricted to a predefined set of allowed values ('s' or 'm').
 * This ensures consistency and adherence to established sizing conventions within the PLM system.
 */
import { ValidationContext, ValidationResult, StyleRequest, MasterStyle } from '../../../types';

export function validateSizeRangeAllowedValues(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  const existing = existingRecord as MasterStyle | null;

  const allowedSizeRanges = ['s', 'm'];

  // Check if size_range is provided and is one of the allowed values
  if (!current.size_range || !allowedSizeRanges.includes(current.size_range)) {
    return {
      valid: false,
      message: `The 'size_range' value '${current.size_range}' is not allowed. It must be one of '${allowedSizeRanges.join("', '")}'.`,
      severity,
      context: {
        allowed_values: allowedSizeRanges,
        provided_value: current.size_range,
        style_code: current.style_code
      },
      ruleName: 'SizeRangeAllowedValues',
      fieldName: 'size_range',
      oldValue: existing?.size_range ?? null,
      newValue: current.size_range,
    };
  }

  // If the size_range is one of the allowed values, it's valid
  return {
    valid: true,
    severity,
    context: {
      allowed_values: allowedSizeRanges,
      provided_value: current.size_range,
      style_code: current.style_code
    },
    ruleName: 'SizeRangeAllowedValues',
    fieldName: 'size_range',
    oldValue: existing?.size_range ?? null,
    newValue: current.size_range,
  };
}
