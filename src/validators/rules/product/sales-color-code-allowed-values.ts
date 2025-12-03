/**
 * Rule: Sales color code must be one of 'black' or 'red'
 * Entity: Product
 * Field: sales_color_code
 * Severity: SOFT
 * When: Both
 *
 * Description:
 * Validates that the `sales_color_code` for a product is restricted to specific, approved values ('black' or 'red').
 * This ensures consistency and adherence to predefined color options within the product catalog.
 */
import { ValidationContext, ValidationResult, ProductRequest, MasterProduct } from '../../../types';

export function validateSalesColorCodeAllowedValues(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to ProductRequest since this is a product validation
  const current = currentRecord as ProductRequest;
  const existing = existingRecord as MasterProduct | null;

  const allowedColorCodes = ['black', 'red'];
  const currentSalesColorCode = current.sales_color_code?.toLowerCase(); // Normalize for comparison

  // Check if the current sales_color_code is one of the allowed values
  if (!allowedColorCodes.includes(currentSalesColorCode)) {
    return {
      valid: false,
      message: `Sales color code '${current.sales_color_code}' is not allowed. It must be one of: ${allowedColorCodes.join(', ')}.`, 
      severity,
      context: {
        allowed_values: allowedColorCodes,
        provided_value: current.sales_color_code,
        product_code: current.code,
        style_code: current.style_code,
      },
      ruleName: 'SalesColorCodeAllowedValues',
      fieldName: 'sales_color_code',
      oldValue: existing?.sales_color_code ?? null,
      newValue: current.sales_color_code,
    };
  }

  // If the sales_color_code is one of the allowed values, the validation passes
  return {
    valid: true,
    severity,
    context: {
      allowed_values: allowedColorCodes,
      provided_value: current.sales_color_code,
      product_code: current.code,
    },
    ruleName: 'SalesColorCodeAllowedValues',
    fieldName: 'sales_color_code',
    oldValue: existing?.sales_color_code ?? null,
    newValue: current.sales_color_code,
  };
}
