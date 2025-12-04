import { validateSizeRangeFootwearOrApparelMediumAllowedValues } from '../size-range-footwear-or-apparel-medium-allowed-values';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateSizeRangeFootwearOrApparelMediumAllowedValues', () => {
  const ruleName = 'SizeRangeFootwearOrApparelMediumAllowedValues';
  const fieldName = 'size_range';
  const severity = 'HARD';

  it('should fail validation - attempting to create a new style with an unallowed size_range', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-ACC-001",
      name: "Winter Gloves",
      category: "Accessories",
      gender: "Unisex",
      size_range: "S", // Invalid value for creation
      vertical: "Lifestyle",
      season_code: "FW24",
      origin_country: "CN",
      product_type: "Gloves"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateSizeRangeFootwearOrApparelMediumAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'S' is not allowed during creation. It must be one of: FTW-W, APP-M.");
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBeUndefined();
  });

  it('should pass validation - successfully creating a new style with allowed size_range (FTW-W)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-SHOE-003",
      name: "Casual Loafers",
      category: "Footwear",
      gender: "Female",
      size_range: "FTW-W", // Valid value for creation
      vertical: "Casual",
      season_code: "SS25",
      origin_country: "PT",
      product_type: "Loafers"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateSizeRangeFootwearOrApparelMediumAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBeUndefined();
  });

  it('should pass validation - successfully creating a new style with allowed size_range (APP-M)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-APP-001",
      name: "Men's T-Shirt",
      category: "Apparel",
      gender: "Male",
      size_range: "APP-M", // Valid value for creation
      vertical: "Sport",
      season_code: "SS25",
      origin_country: "IN",
      product_type: "T-Shirt"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateSizeRangeFootwearOrApparelMediumAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBeUndefined();
  });

  it('should pass validation for existing entity update (rule does not apply)', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW23-SHOE-001",
      name: "Old Boots",
      category: "Footwear",
      gender: "Male",
      size_range: "S", // This value would be invalid for creation, but rule is skipped for update
      vertical: "Outdoor",
      season_code: "FW23",
      origin_country: "VN",
      product_type: "Boots"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW23-SHOE-001",
      name: "Old Boots",
      category: "Footwear",
      gender: "Male",
      size_range: "FTW-M", // Original size range
      vertical: "Outdoor",
      season_code: "FW23",
      status: "Approved",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateSizeRangeFootwearOrApparelMediumAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.message).toBeUndefined();
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.newValue).toBe(currentRecord.size_range);
    expect(result.oldValue).toBe(existingRecord.size_range);
    expect(result.context.reason).toContain('Rule applies only to new style creation, skipping for update.');
  });
});
