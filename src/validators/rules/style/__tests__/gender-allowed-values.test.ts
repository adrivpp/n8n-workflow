import { validateGenderAllowedValues } from '../gender-allowed-values';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateGenderAllowedValues', () => {
  const baseExistingStyle: MasterStyle = {
    style_code: 'SS24-TS-001',
    name: 'Summer Basic T-Shirt',
    category: 'Apparel',
    gender: 'M',
    size_range: 'XS-XL',
    vertical: 'Casualwear',
    season_code: 'SS24',
    status: 'Active',
    data: {}
  };

  it('should fail validation when updating with an invalid gender value (U)', () => {
    const currentRecord: StyleRequest = {
      style_code: 'SS24-TS-001',
      name: 'Summer Basic T-Shirt',
      category: 'Apparel',
      gender: 'U', // Invalid gender
      size_range: 'XS-XL',
      vertical: 'Casualwear',
      season_code: 'SS24',
      origin_country: 'China',
      product_type: 'T-Shirt'
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: { ...baseExistingStyle, gender: 'M' }, // Existing gender is valid
      severity: 'HARD',
    };

    const result = validateGenderAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'gender' field value 'U' is not allowed. It must be either 'M' or 'W'.");
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('gender');
    expect(result.oldValue).toBe('M');
    expect(result.newValue).toBe('U');
    expect(result.ruleName).toBe('GenderAllowedValues');
  });

  it('should pass validation when updating with a valid gender value (M)', () => {
    const currentRecord: StyleRequest = {
      style_code: 'SS24-TS-001',
      name: 'Summer Basic T-Shirt',
      category: 'Apparel',
      gender: 'M', // Valid gender
      size_range: 'XS-XL',
      vertical: 'Casualwear',
      season_code: 'SS24',
      origin_country: 'China',
      product_type: 'T-Shirt'
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: { ...baseExistingStyle, gender: 'W' }, // Existing gender is valid
      severity: 'HARD',
    };

    const result = validateGenderAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('gender');
    expect(result.oldValue).toBe('W');
    expect(result.newValue).toBe('M');
    expect(result.ruleName).toBe('GenderAllowedValues');
  });

  it('should pass validation when updating with a valid gender value (W)', () => {
    const currentRecord: StyleRequest = {
      style_code: 'SS24-TS-002',
      name: 'Winter Jacket',
      category: 'Outerwear',
      gender: 'W', // Valid gender
      size_range: 'S-L',
      vertical: 'Performance',
      season_code: 'FW24',
      origin_country: 'Vietnam',
      product_type: 'Jacket'
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: { ...baseExistingStyle, style_code: 'SS24-TS-002', gender: 'M' },
      severity: 'HARD',
    };

    const result = validateGenderAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('gender');
    expect(result.oldValue).toBe('M');
    expect(result.newValue).toBe('W');
    expect(result.ruleName).toBe('GenderAllowedValues');
  });

  it('should pass validation for new style creation (existingRecord is null)', () => {
    const currentRecord: StyleRequest = {
      style_code: 'NEW-TS-001',
      name: 'New Style',
      category: 'Apparel',
      gender: 'X', // Even an invalid gender passes for new creation as rule applies to updates
      size_range: 'XS-XL',
      vertical: 'Casualwear',
      season_code: 'SS25',
      origin_country: 'India',
      product_type: 'T-Shirt'
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: null, // New entity creation
      severity: 'HARD',
    };

    const result = validateGenderAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('gender');
    expect(result.newValue).toBe('X');
    expect(result.ruleName).toBe('GenderAllowedValues');
  });

  it('should pass validation if gender is unchanged and valid', () => {
    const currentRecord: StyleRequest = {
      style_code: 'SS24-TS-001',
      name: 'Summer Basic T-Shirt',
      category: 'Apparel',
      gender: 'M', // Gender remains 'M'
      size_range: 'XS-XL',
      vertical: 'Casualwear',
      season_code: 'SS24',
      origin_country: 'China',
      product_type: 'T-Shirt'
    };

    const context: ValidationContext = {
      currentRecord,
      existingRecord: { ...baseExistingStyle, gender: 'M' }, // Existing gender is 'M'
      severity: 'HARD',
    };

    const result = validateGenderAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('gender');
    expect(result.oldValue).toBe('M');
    expect(result.newValue).toBe('M');
    expect(result.ruleName).toBe('GenderAllowedValues');
  });
});
