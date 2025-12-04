import { validateSizeRangeSMorLAllowedValues } from '../size-range-s-m-or-l-allowed-values';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateSizeRangeSMorLAllowedValues', () => {
  const ruleName = 'SizeRangeSMorLAllowedValues';
  const fieldName = 'size_range';
  const severity = 'HARD';

  it('should fail validation - attempting to update a style with an unallowed size_range', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-TOP-001",
      name: "Classic T-Shirt",
      category: "Apparel",
      gender: "Female",
      size_range: "XS", // Invalid value
      vertical: "Lifestyle",
      season_code: "SS25",
      origin_country: "BD",
      product_type: "T-Shirt"
    };

    const existingRecord: MasterStyle = {
      style_code: "SS25-TOP-001",
      name: "Classic T-Shirt",
      category: "Apparel",
      gender: "Female",
      size_range: "S", // Original valid value
      vertical: "Lifestyle",
      season_code: "SS25",
      status: "Approved",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateSizeRangeSMorLAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'XS' is not allowed during update. It must be one of: S, M, L.");
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBe(existingRecord.size_range);
  });

  it('should pass validation - successfully updating a style with an allowed size_range (M)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-DRS-002",
      name: "Summer Dress",
      category: "Apparel",
      gender: "Female",
      size_range: "M", // Valid value
      vertical: "Fashion",
      season_code: "SS25",
      origin_country: "TR",
      product_type: "Dress"
    };

    const existingRecord: MasterStyle = {
      style_code: "SS25-DRS-002",
      name: "Summer Dress",
      category: "Apparel",
      gender: "Female",
      size_range: "S", // Original valid value
      vertical: "Fashion",
      season_code: "SS25",
      status: "Approved",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateSizeRangeSMorLAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBe(existingRecord.size_range);
  });

  it('should pass validation - successfully updating a style with an allowed size_range (L)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-DRS-003",
      name: "Evening Gown",
      category: "Apparel",
      gender: "Female",
      size_range: "L", // Valid value
      vertical: "Fashion",
      season_code: "SS25",
      origin_country: "IT",
      product_type: "Dress"
    };

    const existingRecord: MasterStyle = {
      style_code: "SS25-DRS-003",
      name: "Evening Gown",
      category: "Apparel",
      gender: "Female",
      size_range: "M", // Original valid value
      vertical: "Fashion",
      season_code: "SS25",
      status: "Approved",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateSizeRangeSMorLAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBe(existingRecord.size_range);
  });

  it('should pass validation for new entity creation (rule does not apply)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-NEW-001",
      name: "New Item",
      category: "Apparel",
      gender: "Unisex",
      size_range: "XXL", // This value would be invalid for an update, but rule is skipped for creation
      vertical: "Casual",
      season_code: "SS25",
      origin_country: "CN",
      product_type: "Hoodie"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateSizeRangeSMorLAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBeUndefined();
    expect(result.context.reason).toContain('Rule applies only to style updates, skipping for new creation.');
  });
});
