import { ValidationContext, ValidationResult, ProductRequest, MasterProduct } from '../../../types';

/**
 * Rule: The 'season_code' for an existing 'product.code' cannot be changed from its original value once the product record has been created.
 * Entity: Product
 * Field: season_code
 * Severity: HARD
 * When: Update
 *
 * Description:
 * This rule ensures that the 'season_code' of a product remains immutable once the product record has been established.
 * Changing the season code for an existing product could lead to data inconsistencies and operational issues,
 * as products are typically tied to a specific season for planning and sales.
 */
export function validateProductSeasonCodeImmutable(
  context: ValidationContext
): ValidationResult {
  const { currentRecord, existingRecord, severity } = context;

  // Cast to ProductRequest and MasterProduct for type safety
  const current = currentRecord as ProductRequest;
  const existing = existingRecord as MasterProduct | null;

  // If no existing record, this is a new product creation. The rule only applies to updates,
  // so for new creations, it's always valid.
  if (!existing) {
    return {
      valid: true,
      severity,
      context: {
        reason: 'New product creation - season_code is being set for the first time.',
        product_code: current.code,
      },
      ruleName: 'ProductSeasonCodeImmutable',
      fieldName: 'season_code',
      newValue: current.season_code,
    };
  }

  // Check if the season_code has been changed
  if (current.season_code !== existing.season_code) {
    return {
      valid: false,
      message: `The 'season_code' for product '${current.code}' cannot be changed. It was originally '${existing.season_code}' and is attempted to be changed to '${current.season_code}'.`,
      severity,
      context: {
        product_code: current.code,
        previous_season_code: existing.season_code,
        current_season_code: current.season_code,
      },
      ruleName: 'ProductSeasonCodeImmutable',
      fieldName: 'season_code',
      oldValue: existing.season_code,
      newValue: current.season_code,
    };
  }

  // If the season_code has not changed, the validation passes
  return {
    valid: true,
    severity,
    context: {
      reason: 'Season code remains unchanged.',
      product_code: current.code,
      season_code: current.season_code,
    },
    ruleName: 'ProductSeasonCodeImmutable',
    fieldName: 'season_code',
    oldValue: existing.season_code,
    newValue: current.season_code,
  };
}
