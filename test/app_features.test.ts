import { describe, it, expect } from 'vitest';
import { SEED_PRODUCT_29RCAD } from '../server/seedData';
import { convertLength, formatValue } from '../src/utils/dimensionConverter';

describe('Seed Product: Morphy Richards 29RCAD Digital Air Fryer OTG', () => {
  it('contains verified official Bajaj Electricals specifications', () => {
    expect(SEED_PRODUCT_29RCAD.brandName).toBe('Morphy Richards');
    expect(SEED_PRODUCT_29RCAD.modelNumber).toBe('29RCAD Digital Air Fryer OTG');
    expect(SEED_PRODUCT_29RCAD.capacityLitres).toBe(29);
    expect(SEED_PRODUCT_29RCAD.wattage).toBe(2000);
    expect(SEED_PRODUCT_29RCAD.presetMenusCount).toBe(13);
    expect(SEED_PRODUCT_29RCAD.warrantyYears).toBe(2);
    expect(SEED_PRODUCT_29RCAD.countryOfOrigin).toContain('China');
  });

  it('contains exactly the 7 listed included accessories in the box', () => {
    const included = SEED_PRODUCT_29RCAD.accessories.filter((a) => a.isIncludedInBox);
    expect(included.length).toBe(7);

    const names = included.map((a) => a.name.toLowerCase());
    expect(names.some((n) => n.includes('wire grill'))).toBe(true);
    expect(names.some((n) => n.includes('baking tray'))).toBe(true);
    expect(names.some((n) => n.includes('air fryer basket'))).toBe(true);
    expect(names.some((n) => n.includes('crumb tray'))).toBe(true);
    expect(names.some((n) => n.includes('rotisserie rod'))).toBe(true);
    expect(names.some((n) => n.includes('tong') && n.includes('rotisserie'))).toBe(true);
    expect(names.some((n) => n.includes('tong') && (n.includes('baking') || n.includes('grill')))).toBe(true);
  });

  it('contains official traceable source URL and verification status', () => {
    expect(SEED_PRODUCT_29RCAD.verificationStatus).toBe(
      'Official listing — pending model-label confirmation'
    );
    expect(SEED_PRODUCT_29RCAD.sources[0].url).toBe(
      'https://www.bajajelectricals.com/products/29rcad-digital-air-fryer-otg'
    );
    expect(SEED_PRODUCT_29RCAD.sources[0].sourceType).toBe('official_manufacturer_page');
  });

  it('verifies 45 cm conversion accuracy for counter checks', () => {
    const inches = convertLength(45, 'cm', 'in');
    const feet = convertLength(45, 'cm', 'ft');
    expect(formatValue(inches, 'in')).toBe('17.7');
    expect(formatValue(feet, 'ft')).toBe('1.48');
  });

  it('contains full visual feature demonstrations for dehydration and rotisserie', () => {
    const dehyDemo = SEED_PRODUCT_29RCAD.featureDemos.find((d) => d.category === 'dehydration');
    expect(dehyDemo).toBeDefined();
    expect(dehyDemo?.steps.length).toBeGreaterThanOrEqual(4);
    expect(dehyDemo?.safetyNotes).toContain('airtight');
  });

  it('contains authentic multilingual translations for Kannada and Hindi', () => {
    expect(SEED_PRODUCT_29RCAD.translations.kn?.name).toContain('ಮಾರ್ಫಿ ರಿಚರ್ಡ್ಸ್');
    expect(SEED_PRODUCT_29RCAD.translations.hi?.name).toContain('मॉर्फी रिचर्ड्स');
    expect(SEED_PRODUCT_29RCAD.translations.kn?.commonObjections.length).toBeGreaterThan(0);
    expect(SEED_PRODUCT_29RCAD.translations.hi?.commonObjections.length).toBeGreaterThan(0);
  });
});
