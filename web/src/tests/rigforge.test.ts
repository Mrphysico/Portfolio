import { describe, it, expect } from 'vitest';

describe('RigForge Compatibility & Business Engine', () => {
  function checkSocketCompatibility(cpuSocket: string, moboSocket: string): boolean {
    return cpuSocket.toUpperCase() === moboSocket.toUpperCase();
  }

  function checkRamCompatibility(moboChipset: string, ramType: string): boolean {
    if (moboChipset.startsWith('Z790') || moboChipset.startsWith('X670E')) {
      return ramType === 'DDR5';
    }
    return ramType === 'DDR4';
  }

  function calculatePowerHeadroom(systemTdp: number, psuWattage: number): boolean {
    // Recommends at least 20% safe headroom
    return psuWattage >= systemTdp * 1.2;
  }

  function validateUpiUtr(utr: string): boolean {
    return /^\d{12}$/.test(utr);
  }

  it('validates LGA1700 CPU matches LGA1700 motherboard', () => {
    expect(checkSocketCompatibility('LGA1700', 'LGA1700')).toBe(true);
    expect(checkSocketCompatibility('LGA1700', 'AM5')).toBe(false);
  });

  it('validates DDR5 RAM on Z790/X670E motherboards', () => {
    expect(checkRamCompatibility('Z790', 'DDR5')).toBe(true);
    expect(checkRamCompatibility('Z790', 'DDR4')).toBe(false);
  });

  it('calculates safe power budget headroom', () => {
    expect(calculatePowerHeadroom(600, 750)).toBe(true);
    expect(calculatePowerHeadroom(600, 650)).toBe(false); // Less than 120%
  });

  it('validates strict 12-digit Indian UPI UTR number', () => {
    expect(validateUpiUtr('123456789012')).toBe(true);
    expect(validateUpiUtr('12345')).toBe(false);
    expect(validateUpiUtr('12345678901A')).toBe(false);
  });
});
