import { validateStyleNameImmutableAcrossSeasons } from '../style-name-immutable-across-seasons';
import { ValidationContext, StyleRequest, MasterStyle } from '../../../types';

describe('validateStyleNameImmutableAcrossSeasons', () => {
  const baseCurrentRecord: StyleRequest = {
    style_code: 'FW24-TS-001',
    name: 'Classic Tee FW24',
    category: 'Apparel',
    gender: 'Unisex',
    size_range: 'XS-XL',
    vertical: 'Sportswear',
    season_code: 'FW24',
    origin_country: 'China',
    product_type: 'T-Shirt',
  };

  const baseExistingRecord: MasterStyle = {
    style_code: 'FW24-TS-001',
    name: 'Classic Tee FW24',
    category: 'Apparel',
    gender: 'Unisex',
    size_range: 'XS-XL',
    vertical: 'Sportswear',
    season_code: 'FW24',
    status: 'Approved',
    data: {},
  };

  it('should fail validation when both name and season_code change', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseCurrentRecord,
        name: 'Updated Classic Tee SS25',
        season_code: 'SS25',
      },
      existingRecord: {
        ...baseExistingRecord,
        name: 'Classic Tee FW24',
        season_code: 'FW24',
      },
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(false);
    expect(result.message).toContain('Style name cannot change between seasons.');
    expect(result.message).toContain('Previous name: "Classic Tee FW24" (Season: FW24), Current name: "Updated Classic Tee SS25" (Season: SS25).');
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('name');
    expect(result.oldValue).toBe('Classic Tee FW24');
    expect(result.newValue).toBe('Updated Classic Tee SS25');
    expect(result.context).toEqual(expect.objectContaining({
      previous_name: 'Classic Tee FW24',
      current_name: 'Updated Classic Tee SS25',
      previous_season: 'FW24',
      current_season: 'SS25',
      style_code: 'FW24-TS-001',
    }));
  });

  it('should pass validation when name changes but season_code remains the same', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseCurrentRecord,
        name: 'New Padded Jacket FW24',
        season_code: 'FW24', // Season code is unchanged
      },
      existingRecord: {
        ...baseExistingRecord,
        name: 'Padded Jacket FW24',
        season_code: 'FW24',
      },
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('name');
    expect(result.oldValue).toBe('Padded Jacket FW24');
    expect(result.newValue).toBe('New Padded Jacket FW24');
    expect(result.context.reason).toBe('Name changed, but season code remained the same (allowed)');
  });

  it('should pass validation when season_code changes but name remains the same', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseCurrentRecord,
        name: 'Classic Tee FW24',
        season_code: 'SS25', // Season code changed
      },
      existingRecord: {
        ...baseExistingRecord,
        name: 'Classic Tee FW24',
        season_code: 'FW24',
      },
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('name');
    expect(result.oldValue).toBe('Classic Tee FW24');
    expect(result.newValue).toBe('Classic Tee FW24');
    expect(result.context.reason).toBe('Season code changed, but name remained the same (allowed)');
  });

  it('should pass validation when neither name nor season_code change', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseCurrentRecord,
        name: 'Classic Tee FW24',
        season_code: 'FW24',
      },
      existingRecord: {
        ...baseExistingRecord,
        name: 'Classic Tee FW24',
        season_code: 'FW24',
      },
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('name');
    expect(result.oldValue).toBe('Classic Tee FW24');
    expect(result.newValue).toBe('Classic Tee FW24');
    expect(result.context.reason).toBe('Neither name nor season code changed');
  });

  it('should pass validation for new entity creation (no existingRecord)', () => {
    const context: ValidationContext = {
      currentRecord: {
        ...baseCurrentRecord,
        style_code: 'NEW-TS-001',
        name: 'Brand New Tee SS25',
        season_code: 'SS25',
      },
      existingRecord: null,
      severity: 'HARD',
    };

    const result = validateStyleNameImmutableAcrossSeasons(context);

    expect(result.valid).toBe(true);
    expect(result.severity).toBe('HARD');
    expect(result.fieldName).toBe('name');
    expect(result.oldValue).toBeUndefined(); // Or null, depending on how oldValue is set for new records
    expect(result.newValue).toBe('Brand New Tee SS25');
    expect(result.context.reason).toBe('New style creation - no historical comparison needed');
  });
});
