import { validateProductTypeMustBeTestOrDumb } from '../product-type-must-be-test-or-dumb';
import { ValidationContext, StyleRequest } from '../../../types';

describe('validateProductTypeMustBeTestOrDumb', () => {
  const baseStyleRequest: StyleRequest = {
    style_code: 'SS25-SHOE-001',
    name: 'Spring Sneaker',
    category: 'Footwear',
    gender: 'Unisex',
    size_range: 'EU 36-47',
    vertical: 'Lifestyle',
    season_code: 'SS25'
  };

  it('should fail validation when product_type is an invalid value (e.g., "footwear") - HARD severity', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: 'footwear'
      },
      existingRecord: null,
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Product type must be one of 'test', 'dumb'. Current value: 'footwear'.");
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBe('footwear');
  });

  it('should pass validation when product_type is "test"', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: 'test'
      },
      existingRecord: null,
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBe('test');
  });

  it('should pass validation when product_type is "dumb"', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: 'dumb'
      },
      existingRecord: null,
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBe('dumb');
  });

  it('should pass validation when product_type is null (optional field)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: null
      },
      existingRecord: null,
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBeNull();
  });

  it('should pass validation when product_type is undefined (optional field)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: undefined
      },
      existingRecord: null,
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBeUndefined();
  });

  it('should pass validation for an update where product_type remains valid', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: 'test'
      },
      existingRecord: {
        style_code: 'SS25-SHOE-001',
        name: 'Spring Sneaker',
        category: 'Footwear',
        gender: 'Unisex',
        size_range: 'EU 36-47',
        vertical: 'Lifestyle',
        season_code: 'SS25',
        status: 'Approved',
        data: { product_type: 'test' }
      },
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(true);
  });

  it('should fail validation for an update where product_type changes to an invalid value', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseStyleRequest,
        product_type: 'invalid_type'
      },
      existingRecord: {
        style_code: 'SS25-SHOE-001',
        name: 'Spring Sneaker',
        category: 'Footwear',
        gender: 'Unisex',
        size_range: 'EU 36-47',
        vertical: 'Lifestyle',
        season_code: 'SS25',
        status: 'Approved',
        data: { product_type: 'test' }
      },
      severity: 'HARD'
    };

    const result = validateProductTypeMustBeTestOrDumb(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain("Product type must be one of 'test', 'dumb'. Current value: 'invalid_type'.");
    expect(result.fieldName).toBe('product_type');
    expect(result.newValue).toBe('invalid_type');
    expect(result.oldValue).toBe('test'); // Assuming existingRecord.data.product_type can be accessed or inferred
  });
});
