import { describe, it, expect } from 'vitest';
import {
  filterAlumniDirectory,
  generateVerificationBarcode,
  INITIAL_ALUMNI_ROSTER,
} from '../alumni';

describe('Alumni Directory & Official Transcript Verification Engine', () => {
  it('filters alumni by graduation batch year and academic stream', () => {
    const batch2021 = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 2021);
    expect(batch2021.length).toBe(1);
    expect(batch2021[0].name).toBe('Rohan Deshmukh');

    const scienceGrads = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'SCIENCE');
    expect(scienceGrads.length).toBe(2);
    expect(scienceGrads.every((a) => a.stream === 'SCIENCE')).toBe(true);

    const humanitiesGrads = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'HUMANITIES');
    expect(humanitiesGrads.length).toBe(1);
    expect(humanitiesGrads[0].name).toBe('Tanvi Saxena');
  });

  it('searches alumni by career, institution, or keyword', () => {
    const aiimsSearch = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'ALL', 'AIIMS');
    expect(aiimsSearch.length).toBe(1);
    expect(aiimsSearch[0].name).toBe('Dr. Siddharth Varma');

    const googleSearch = filterAlumniDirectory(INITIAL_ALUMNI_ROSTER, 'ALL', 'ALL', 'Apple');
    expect(googleSearch.length).toBe(1);
    expect(googleSearch[0].location).toContain('San Francisco');
  });

  it('generates compliant institutional verification barcodes for WES & transcripts', () => {
    const barcode = generateVerificationBarcode('ADM-2016-042', 'WES_APOSTILLE_VERIFICATION');
    expect(barcode).toContain('VIDYA-ADM-2016-042');
    expect(barcode).toContain('WES');
  });
});
