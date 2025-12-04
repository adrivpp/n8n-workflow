import { ValidationContext, ValidationResult, StyleRequest, MasterStyle } from '../../../types';

/**
 * Rule: size_range must be one of FTW-W or APP-M
 * Entity: Style
 * Field: size_range
 * Severity: HARD
 * When: Creation
 *
 * Description:
 * Validates that during the creation of a new style, the 'size_range' field
 * is set to one of the specifically allowed values: 'FTW-W' (Footwear Women's)
 * or 'APP-M' (Apparel Men's). This ensures new styles conform to predefined
 * sizing conventions for specific product categories.
 */
export function validateSizeRangeFootwearOrApparelMediumAllowedValues(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  // existingRecord is MasterStyle | null, but for creation it will be null

  const allowedSizeRanges = ['FTW-W', 'APP-M'];

  // This rule applies only during new style creation (when existingRecord is null).
  // If existingRecord is present, it's an update, and this rule does not apply.
  if (existingRecord) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'Rule applies only to new style creation, skipping for update.',
        style_code: current.style_code,
        current_size_range: current.size_range,
      },
      ruleName: 'SizeRangeFootwearOrApparelMediumAllowedValues',
      fieldName: 'size_range',
      oldValue: (existingRecord as MasterStyle).size_range,
      newValue: current.size_range,
    };
  }

  // If it's a new style creation, check if the current size_range is one of the allowed values
  if (!allowedSizeRanges.includes(current.size_range)) {
    return {
      valid: false,
      message: `The 'size_range' value '${current.size_range}' is not allowed during creation. It must be one of: ${allowedSizeRanges.join(', ')}.`, 
      severity,
      context: {
        allowed_values: allowedSizeRanges,
        style_code: current.style_code,
        current_size_range: current.size_range,
      },
      ruleName: 'SizeRangeFootwearOrApparelMediumAllowedValues',
      fieldName: 'size_range',
      newValue: current.size_range,
    };
  }

  // If the size_range is valid for a new creation
  return {
    valid: true,
    severity,
    context: {
      style_code: current.style_code,
      current_size_range: current.size_range,
    },
    ruleName: 'SizeRangeFootwearOrApparelMediumAllowedValues',
    fieldName: 'size_range',
    newValue: current.size_range,
  };
}
