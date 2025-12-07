import { validateStyleNameImmutableAfterCreation } from '../style-name-immutable-after-creation';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateStyleNameImmutableAfterCreation', () => {
  const ruleName = 'StyleNameImmutableAfterCreation';
  const fieldName = 'name';
  const severity = 'HARD'; // As per approved rule

  it('should fail validation when style name is changed on an existing record', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-SH-001",
      name: "Classic Running Shoe v2.0", // Changed
      category: "Footwear",
      gender: "Unisex",
      size_range: "US 5-12",
      vertical: "Performance",
      season_code: "FW24",
      origin_country: "Vietnam",
      product_type: "Sneaker"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW24-SH-001",
      name: "Classic Running Shoe", // Original
      category: "Footwear",
      gender: "Unisex",
      size_range: "US 5-12",
      vertical: "Performance",
      season_code: "FW24",
      status: "Approved",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain('Style name cannot be changed after creation.');
    expect(result.message).toContain(`Previous: "${existingRecord.name}", Current: "${currentRecord.name}".`);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBe(existingRecord.name);
    expect(result.newValue).toBe(currentRecord.name);
    expect(result.context).toEqual(expect.objectContaining({
      style_code: currentRecord.style_code,
      previous_name: existingRecord.name,
      current_name: currentRecord.name,
    }));
  });

  it('should pass validation when style name remains unchanged on an existing record', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-TS-005",
      name: "Organic Cotton Tee", // Unchanged
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      origin_country: "Portugal",
      product_type: "T-Shirt"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW24-TS-005",
      name: "Organic Cotton Tee", // Original
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      status: "In Development",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBe(existingRecord.name);
    expect(result.newValue).toBe(currentRecord.name);
    expect(result.context).toEqual(expect.objectContaining({
      reason: 'Style name remains unchanged (or only whitespace adjusted).',
      style_code: currentRecord.style_code,
    }));
  });

  it('should pass validation for new style creation (no existing record)', () => {
    const currentRecord: StyleRequest = {
      style_code: "SS25-JK-010",
      name: "Lightweight Summer Jacket",
      category: "Apparel",
      gender: "Male",
      size_range: "S-XXL",
      vertical: "Outdoor",
      season_code: "SS25",
      origin_country: "China",
      product_type: "Jacket"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBeNull();
    expect(result.newValue).toBe(currentRecord.name);
    expect(result.context).toEqual(expect.objectContaining({
      reason: 'New style creation - name is being set for the first time.',
      style_code: currentRecord.style_code,
    }));
  });

  it('should pass if only leading/trailing whitespace changes for the name', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-TS-005",
      name: "  Organic Cotton Tee  ", // Current with whitespace
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      origin_country: "Portugal",
      product_type: "T-Shirt"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW24-TS-005",
      name: "Organic Cotton Tee", // Original without whitespace
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      status: "In Development",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);
    expect(result.valid).toBe(true); // Should pass because trimmed names are equal
  });

  it('should fail if name changes from null to a value', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-TS-005",
      name: "Organic Cotton Tee",
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      origin_country: "Portugal",
      product_type: "T-Shirt"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW24-TS-005",
      name: null, // Original was null
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      status: "In Development",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Style name cannot be changed after creation.');
    expect(result.message).toContain(`Previous: "null", Current: "${currentRecord.name}".`);
    expect(result.oldValue).toBeNull();
    expect(result.newValue).toBe(currentRecord.name);
  });

  it('should fail if name changes from a value to null', () => {
    const currentRecord: StyleRequest = {
      style_code: "FW24-TS-005",
      name: null, // Current is null
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      origin_country: "Portugal",
      product_type: "T-Shirt"
    };

    const existingRecord: MasterStyle = {
      style_code: "FW24-TS-005",
      name: "Organic Cotton Tee", // Original was a value
      category: "Apparel",
      gender: "Female",
      size_range: "XS-XL",
      vertical: "Lifestyle",
      season_code: "FW24",
      status: "In Development",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateStyleNameImmutableAfterCreation(context);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('Style name cannot be changed after creation.');
    expect(result.message).toContain(`Previous: "${existingRecord.name}", Current: "null".`);
    expect(result.oldValue).toBe(existingRecord.name);
    expect(result.newValue).toBeNull();
  });
});
