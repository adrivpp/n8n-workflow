import { validateSalesColorCodeAllowedValues } from '../sales-color-code-allowed-values';
import { ValidationContext, ProductRequest, MasterProduct } from '../../../types';

describe('validateSalesColorCodeAllowedValues', () => {
  const baseProduct: ProductRequest = {
    code: 'FW24-TS-001-BLU',
    style_code: 'FW24-TS-001',
    sales_color_code: 'blue',
    sales_color_name: 'Sky Blue',
    sales_availability: 'In Stock',
    season_code: 'FW24',
    drop_out_date: null,
    original_launch_date: '2024-08-15',
  };

  it('should fail validation - sales_color_code is not black or red (invalid_example)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        sales_color_code: 'blue',
      },
      existingRecord: null,
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Sales color code 'blue' is not allowed. It must be one of: black, red.");
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.severity).toBe('SOFT');
    expect(result.newValue).toBe('blue');
  });

  it('should pass validation - sales_color_code is red (valid_example)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        sales_color_code: 'red',
      },
      existingRecord: null,
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.severity).toBe('SOFT');
    expect(result.newValue).toBe('red');
  });

  it('should pass validation - sales_color_code is black', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        sales_color_code: 'black',
      },
      existingRecord: null,
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.severity).toBe('SOFT');
    expect(result.newValue).toBe('black');
  });

  it('should pass validation for new entity creation with a valid sales_color_code', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        sales_color_code: 'red',
      },
      existingRecord: null, // No historical data
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.newValue).toBe('red');
  });

  it('should fail validation for update with an invalid sales_color_code', () => {
    const existingProduct: MasterProduct = {
      code: 'FW24-TS-001-RED',
      style_code: 'FW24-TS-001',
      sales_color_code: 'red',
      sales_color_name: 'Fiery Red',
      sales_availability: 'In Stock',
      season_code: 'FW24',
      status: 'Active',
      data: {},
    };

    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        code: 'FW24-TS-001-RED',
        sales_color_code: 'green', // Invalid update
      },
      existingRecord: existingProduct,
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Sales color code 'green' is not allowed.");
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.oldValue).toBe('red');
    expect(result.newValue).toBe('green');
  });

  it('should pass validation for update with a valid sales_color_code', () => {
    const existingProduct: MasterProduct = {
      code: 'FW24-TS-001-RED',
      style_code: 'FW24-TS-001',
      sales_color_code: 'red',
      sales_color_name: 'Fiery Red',
      sales_availability: 'In Stock',
      season_code: 'FW24',
      status: 'Active',
      data: {},
    };

    const context: ValidationContext = {
      currentRecord: {
        ...baseProduct,
        code: 'FW24-TS-001-RED',
        sales_color_code: 'black', // Valid update
      },
      existingRecord: existingProduct,
      severity: 'SOFT',
    };

    const result = validateSalesColorCodeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('sales_color_code');
    expect(result.oldValue).toBe('red');
    expect(result.newValue).toBe('black');
  });
});
