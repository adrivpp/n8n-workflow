import { validateStyleNameImmutableAcrossSeasons } from '../style-name-immutable-across-seasons';
import { ValidationContext } from '../../../../types';

describe('validateStyleNameImmutableAcrossSeasons', () => {
  it('should fail validation when style name changes between seasons', () => {
    const context: ValidationContext = {
      currentRecord: {
        style_code: 'ST001',
        name: 'New Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS25',
      },
      existingRecord: {
        style_code: 'ST001',
        name: 'Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS24',
        status: 'active',
        data: {},
      },
      severity: 'SOFT',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain(
      'Style name cannot change between seasons'
    );
    expect(result.message).toContain('Summer Dress');
    expect(result.message).toContain('New Summer Dress');
    expect(result.fieldName).toBe('name');
    expect(result.severity).toBe('SOFT');
    expect(result.oldValue).toBe('Summer Dress');
    expect(result.newValue).toBe('New Summer Dress');
  });

  it('should pass validation when style name remains the same across seasons', () => {
    const context: ValidationContext = {
      currentRecord: {
        style_code: 'ST001',
        name: 'Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS25',
      },
      existingRecord: {
        style_code: 'ST001',
        name: 'Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS24',
        status: 'active',
        data: {},
      },
      severity: 'SOFT',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('name');
    expect(result.context.reason).toBe('Name unchanged');
  });

  it('should pass validation when name changes within the same season', () => {
    const context: ValidationContext = {
      currentRecord: {
        style_code: 'ST001',
        name: 'Updated Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS24',
      },
      existingRecord: {
        style_code: 'ST001',
        name: 'Summer Dress',
        category: 'Dresses',
        gender: 'Women',
        size_range: 'XS-XL',
        vertical: 'Fashion',
        season_code: 'SS24',
        status: 'active',
        data: {},
      },
      severity: 'SOFT',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('name');
    expect(result.context.reason).toBe(
      'Same season update - name change allowed'
    );
  });

  it('should pass validation for new entity creation', () => {
    const context: ValidationContext = {
      currentRecord: {
        style_code: 'ST002',
        name: 'New Winter Coat',
        category: 'Outerwear',
        gender: 'Men',
        size_range: 'S-XXL',
        vertical: 'Fashion',
        season_code: 'FW25',
      },
      existingRecord: null,
      severity: 'SOFT',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.fieldName).toBe('name');
    expect(result.context.reason).toBe(
      'New style creation - no historical comparison needed'
    );
  });

  it('should handle undefined existingRecord gracefully', () => {
    const context: ValidationContext = {
      currentRecord: {
        style_code: 'ST003',
        name: 'Spring Collection',
        category: 'Accessories',
        gender: 'Unisex',
        size_range: 'One Size',
        vertical: 'Fashion',
        season_code: 'SS25',
      },
      existingRecord: undefined,
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
  });
});
