import { evaluateSynergy } from '../../src/backend/src/services/synergyService';
import { mockExecuteSpannerSql } from './mockSpanner';

jest.mock('../../src/backend/src/config/spanner', () => ({
  executeSpannerSql: jest.fn().mockImplementation((query) => mockExecuteSpannerSql(query)),
  projectId: 'hifi-shop-demo'
}));

describe('synergyService Unit Tests', () => {
  describe('Single Component Handling', () => {
    it('should return default optimal result when less than 2 products are provided', async () => {
      const result = await evaluateSynergy({ product_ids: ['prod-feliks-envy'] });
      expect(result.is_compatible).toBe(true);
      expect(result.synergy_score).toBe(100);
      expect(result.badge).toBe('Single Component Selected');
      expect(result.badge_zh).toBe('單一器材已選擇');
      expect(result.checks).toHaveLength(0);
    });
  });

  describe('Electrical Impedance & Tube Amp Pairing Rules', () => {
    it('should detect OPTIMAL pairing for Feliks Audio Envy tube amp + Sennheiser HD 800 S (300 ohm)', async () => {
      const result = await evaluateSynergy({
        product_ids: ['prod-feliks-envy', 'prod-sennheiser-hd800s'],
        lang: 'en-US'
      });

      expect(result.is_compatible).toBe(true);
      expect(result.synergy_score).toBeGreaterThanOrEqual(90);
      expect(result.badge).toBe('Optimal High-Impedance Tube Match');
      
      const impedanceCheck = result.checks.find(c => c.type === 'impedance_matching');
      expect(impedanceCheck).toBeDefined();
      expect(impedanceCheck?.status).toBe('OPTIMAL');
      expect(impedanceCheck?.title_en).toContain('High-Impedance Tube');
      expect(result.warnings).toHaveLength(0);
    });

    it('should generate WARNING for tube amp paired with low-impedance sensitive IEM (Campfire Andromeda 12.8 ohm)', async () => {
      const result = await evaluateSynergy({
        product_ids: ['prod-feliks-envy', 'prod-campfire-andromeda-2020'],
        lang: 'en-US'
      });

      expect(result.is_compatible).toBe(false);
      expect(result.synergy_score).toBeLessThan(80);
      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('low impedance');

      const gainCheck = result.checks.find(c => c.type === 'gain_staging');
      expect(gainCheck).toBeDefined();
      expect(gainCheck?.status).toBe('WARNING');
      expect(gainCheck?.title_en).toContain('Noise Floor & Gain Staging');
    });

    it('should generate WARNING in Traditional Chinese (zh-HK) for low-impedance tube amp pairing', async () => {
      const result = await evaluateSynergy({
        product_ids: ['prod-feliks-envy', 'prod-campfire-andromeda-2020'],
        lang: 'zh-HK'
      });

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('阻抗極低');
    });
  });

  describe('Signal Chain Interface Compatibility (XLR / I2S)', () => {
    it('should detect Fully Balanced XLR Interconnect support between DAC and Amp', async () => {
      const result = await evaluateSynergy({
        product_ids: ['prod-denafrips-venus-ii', 'prod-mcintosh-ma8950'],
        lang: 'en-US'
      });

      const interfaceCheck = result.checks.find(c => c.type === 'interface_compatibility');
      expect(interfaceCheck).toBeDefined();
      expect(interfaceCheck?.status).toBe('OPTIMAL');
      expect(interfaceCheck?.title_en).toContain('Balanced XLR Interconnect');
      expect(result.recommendations.some(r => r.includes('Balanced XLR'))).toBe(true);
    });
  });

  describe('Active Loudspeaker Redundancy Check', () => {
    it('should trigger WARNING when active speaker (KEF LS50 Wireless II) is paired with power amp', async () => {
      const result = await evaluateSynergy({
        product_ids: ['prod-kef-ls50-wireless-ii', 'prod-mcintosh-ma8950'],
        lang: 'en-US'
      });

      expect(result.is_compatible).toBe(false);
      expect(result.warnings.some(w => w.includes('active wireless speaker'))).toBe(true);

      const redundancyCheck = result.checks.find(c => c.type === 'gain_staging');
      expect(redundancyCheck).toBeDefined();
      expect(redundancyCheck?.status).toBe('WARNING');
      expect(redundancyCheck?.title_en).toContain('Active Loudspeaker Redundancy');
    });
  });
});
