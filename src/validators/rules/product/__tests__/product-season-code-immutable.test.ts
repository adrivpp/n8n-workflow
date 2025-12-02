import { validateProductSeasonCodeImmutable } from '../product-season-code-immutable';
import { ValidationContext, ProductRequest, MasterProduct } from '../../../types';

describe('validateProductSeasonCodeImmutable', () => {
  const ruleName = 'ProductSeasonCodeImmutable';
  const fieldName = 'season_code';
  const severity = 'HARD';

  it('should fail validation when season_code is changed for an existing product', () => {
    const currentRecord: ProductRequest = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Black",
      sales_availability: "In Stock",
      season_code: "SS25", // Changed from FW24
      drop_out_date: null,
      original_launch_date: "2023-08-15"
    };

    const existingRecord: MasterProduct = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Black",
      sales_availability: "In Stock",
      season_code: "FW24", // Original value
      status: "Active",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateProductSeasonCodeImmutable(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain(`The 'season_code' for product 'FW24-SH-001-BLK' cannot be changed. It was originally 'FW24' and is attempted to be changed to 'SS25'.`);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBe("FW24");
    expect(result.newValue).toBe("SS25");
    expect(result.context).toEqual(expect.objectContaining({
      product_code: "FW24-SH-001-BLK",
      previous_season_code: "FW24",
      current_season_code: "SS25"
    }));
  });

  it('should pass validation when season_code remains unchanged for an existing product', () => {
    const currentRecord: ProductRequest = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Black",
      sales_availability: "In Stock",
      season_code: "FW24", // Unchanged
      drop_out_date: null,
      original_launch_date: "2023-08-15"
    };

    const existingRecord: MasterProduct = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Black",
      sales_availability: "In Stock",
      season_code: "FW24", // Original value
      status: "Active",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateProductSeasonCodeImmutable(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBe("FW24");
    expect(result.newValue).toBe("FW24");
    expect(result.context).toEqual(expect.objectContaining({
      reason: 'Season code remains unchanged.',
      product_code: "FW24-SH-001-BLK",
      season_code: "FW24"
    }));
  });

  it('should pass validation for new product creation (existingRecord is null)', () => {
    const currentRecord: ProductRequest = {
      code: "SS25-TS-002-WHT",
      style_code: "SS25-TS-002",
      sales_color_code: "WHT",
      sales_color_name: "White",
      sales_availability: "Pre-Order",
      season_code: "SS25",
      drop_out_date: null,
      original_launch_date: "2024-01-01"
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New creation
      severity,
    };

    const result = validateProductSeasonCodeImmutable(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBeNull();
    expect(result.newValue).toBe("SS25");
    expect(result.context).toEqual(expect.objectContaining({
      reason: 'New product creation - season_code is being set for the first time.',
      product_code: "SS25-TS-002-WHT"
    }));
  });

  it('should pass validation when other fields change but season_code does not', () => {
    const currentRecord: ProductRequest = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Jet Black", // Changed
      sales_availability: "Out of Stock", // Changed
      season_code: "FW24", // Unchanged
      drop_out_date: "2024-12-31", // Changed
      original_launch_date: "2023-08-15"
    };

    const existingRecord: MasterProduct = {
      code: "FW24-SH-001-BLK",
      style_code: "FW24-SH-001",
      sales_color_code: "BLK",
      sales_color_name: "Black",
      sales_availability: "In Stock",
      season_code: "FW24", // Original value
      status: "Active",
      data: {}
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord,
      severity,
    };

    const result = validateProductSeasonCodeImmutable(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe(severity);
    expect(result.ruleName).toBe(ruleName);
    expect(result.fieldName).toBe(fieldName);
    expect(result.oldValue).toBe("FW24");
    expect(result.newValue).toBe("FW24");
  });
});
