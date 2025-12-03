/**
 * Rule: product_type should be one of test or dumb for styles.
 * Entity: Style
 * Field: product_type
 * Severity: HARD
 * When: Both
 *
 * Description:
 * This rule ensures that the 'product_type' field for a style, if provided,
 * must be one of the predefined values: 'test' or 'dumb'. This helps maintain
 * data integrity and consistency for style categorization within the system.
 */
export function validateProductTypeMustBeTestOrDumb(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, severity } = context;

  // Cast to StyleRequest since this is a style validation
  const current = currentRecord as StyleRequest;

  // Allowed values for product_type
  const allowedProductTypes = ['test', 'dumb'];

  // If product_type is null or undefined, it's considered valid as the field is optional
  if (current.product_type === null || current.product_type === undefined) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'product_type is optional and not provided.',
        style_code: current.style_code,
      },
      ruleName: 'ProductTypeMustBeTestOrDumb',
      fieldName: 'product_type',
      newValue: current.product_type,
    };
  }

  // Check if the provided product_type is one of the allowed values
  if (!allowedProductTypes.includes(current.product_type)) {
    return {
      valid: false,
      message: `Product type must be one of '${allowedProductTypes.join("', '")}'. Current value: '${current.product_type}'.`,
      severity,
      context: {
        style_code: current.style_code,
        allowed_values: allowedProductTypes,
      },
      ruleName: 'ProductTypeMustBeTestOrDumb',
      fieldName: 'product_type',
      newValue: current.product_type,
    };
  }

  // If the product_type is one of the allowed values, it's valid
  return {
    valid: true,
    severity,
    context: {
      reason: 'product_type is valid.',
      style_code: current.style_code,
    },
    ruleName: 'ProductTypeMustBeTestOrD_umb',
    fieldName: 'product_type',
    newValue: current.product_type,
  };
}
