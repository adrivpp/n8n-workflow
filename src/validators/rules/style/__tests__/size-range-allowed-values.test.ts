import { validateSizeRangeAllowedValues } from '../size-range-allowed-values';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateSizeRangeAllowedValues', () => {
  const baseStyleRequest: StyleRequest = {
    style_code: 'SS25-TOP-005',
    name: 'Summer Crop Top',
    category: 'Apparel',
    gender: 'Female',
    size_range: 's', // Default valid
    vertical: 'Womenswear',
    season_code: 'SS25',
    origin_country: 'China',
    product_type: 'Top'
  };

  it('should fail validation when size_range is an disallowed value (invalid_example)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 'l'
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'l' is not allowed. It must be one of 's', 'm'.");
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe('l');
    expect(result.severity).toBe('HARD');
  });

  it('should pass validation when size_range is an allowed value (valid_example - m)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 'm'
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe('m');
    expect(result.severity).toBe('HARD');
  });

  it('should pass validation when size_range is an allowed value (s)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 's'
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe('s');
    expect(result.severity).toBe('HARD');
  });

  it('should pass validation for new entity creation with a valid size_range', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 's'
      } as StyleRequest,
      existingRecord: null, // No historical data
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe('s');
  });

  it('should fail validation if size_range is empty string', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: ''
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value '' is not allowed. It must be one of 's', 'm'.");
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe('');
  });

  it('should fail validation if size_range is null', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: null
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'null' is not allowed. It must be one of 's', 'm'.");
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe(null);
  });

  it('should fail validation if size_range is undefined', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: undefined
      } as StyleRequest,
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'undefined' is not allowed. It must be one of 's', 'm'.");
    expect(result.fieldName).toBe('size_range');
    expect(result.newValue).toBe(undefined);
  });

  it('should pass validation during update if size_range remains valid', () => {
    const existingRecord: MasterStyle = {
      style_code: 'SS25-TOP-005',
      name: 'Summer Crop Top',
      category: 'Apparel',
      gender: 'Female',
      size_range: 's',
      vertical: 'Womenswear',
      season_code: 'SS25',
      status: 'Approved',
      data: {}
    };

    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 'm'
      } as StyleRequest,
      existingRecord: existingRecord,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('size_range');
    expect(result.oldValue).toBe('s');
    expect(result.newValue).toBe('m');
  });

  it('should fail validation during update if size_range changes to an invalid value', () => {
    const existingRecord: MasterStyle = {
      style_code: 'SS25-TOP-005',
      name: 'Summer Crop Top',
      category: 'Apparel',
      gender: 'Female',
      size_range: 's',
      vertical: 'Womenswear',
      season_code: 'SS25',
      status: 'Approved',
      data: {}
    };

    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        size_range: 'xl'
      } as StyleRequest,
      existingRecord: existingRecord,
      severity: 'HARD',
    };

    const result = validateSizeRangeAllowedValues(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("The 'size_range' value 'xl' is not allowed. It must be one of 's', 'm'.");
    expect(result.fieldName).toBe('size_range');
    expect(result.oldValue).toBe('s');
    expect(result.newValue).toBe('xl');
  });
});
