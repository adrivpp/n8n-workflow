/**
 * Rule: Gender should be one of M or W
 * Entity: Style
 * Field: gender
 * Severity: HARD
 * When: Update
 * 
 * Description:
 * Validates that the 'gender' field for a Style entity is restricted to specific
 * allowed values: 'M' (Male) or 'W' (Female). This ensures data consistency
 * and adherence to defined product attributes during updates.
 */
import { ValidationContext, ValidationResult, StyleRequest, MasterStyle } from '../../../types';

export function validateGenderAllowedValues(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;
  
  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;
  const existing = existingRecord as MasterStyle | null;
  
  // This rule applies only to updates. If no existing record, it's a new creation,
  // and this specific rule does not apply (it will be caught by creation-time rules if needed).
  if (!existing) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'New style creation - rule applies only to updates',
        style_code: current.style_code
      },
      ruleName: 'GenderAllowedValues',
      fieldName: 'gender',
      newValue: current.gender,
    };
  }

  // Define allowed gender values
  const allowedGenders = ['M', 'W'];

  // Check if the current gender value is within the allowed list
  if (!allowedGenders.includes(current.gender)) {
    return {
      valid: false,
      message: `The 'gender' field value '${current.gender}' is not allowed. It must be either 'M' or 'W'.`,
      severity,
      context: {
        style_code: current.style_code,
        allowed_values: allowedGenders,
        current_gender: current.gender,
      },
      ruleName: 'GenderAllowedValues',
      fieldName: 'gender',
      oldValue: existing.gender,
      newValue: current.gender,
    };
  }
  
  // If the gender is one of the allowed values, the validation passes
  return {
    valid: true,
    severity,
    context: {
      style_code: current.style_code,
      current_gender: current.gender,
    },
    ruleName: 'GenderAllowedValues',
    fieldName: 'gender',
    oldValue: existing.gender,
    newValue: current.gender,
  };
}
