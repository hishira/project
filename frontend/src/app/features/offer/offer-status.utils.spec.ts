import { getStatusLabel, getStatusClass, getApprovalStatusClass } from './offer-status.utils';

describe('offer-status.utils', () => {
  describe('getStatusLabel', () => {
    test('should return "Szkic" for draft status', () => {
      expect(getStatusLabel('draft')).toBe('Szkic');
    });

    test('should return "Wysłana" for sent status', () => {
      expect(getStatusLabel('sent')).toBe('Wysłana');
    });

    test('should return "Zaakceptowana" for accepted status', () => {
      expect(getStatusLabel('accepted')).toBe('Zaakceptowana');
    });

    test('should return "Odrzucona" for rejected status', () => {
      expect(getStatusLabel('rejected')).toBe('Odrzucona');
    });

    test('should return "Wygasła" for expired status', () => {
      expect(getStatusLabel('expired')).toBe('Wygasła');
    });

    test('should return original status if unknown', () => {
      expect(getStatusLabel('unknown' as any)).toBe('unknown');
    });
  });

  describe('getStatusClass', () => {
    test('should return "status-draft" for draft status', () => {
      expect(getStatusClass('draft')).toBe('status-draft');
    });

    test('should return "status-sent" for sent status', () => {
      expect(getStatusClass('sent')).toBe('status-sent');
    });

    test('should return "status-accepted" for accepted status', () => {
      expect(getStatusClass('accepted')).toBe('status-accepted');
    });

    test('should return "status-rejected" for rejected status', () => {
      expect(getStatusClass('rejected')).toBe('status-rejected');
    });

    test('should return "status-expired" for expired status', () => {
      expect(getStatusClass('expired')).toBe('status-expired');
    });

    test('should return empty string for unknown status', () => {
      expect(getStatusClass('unknown' as any)).toBe('');
    });
  });

  describe('getApprovalStatusClass', () => {
    test('should return "status-pending" for pending status', () => {
      expect(getApprovalStatusClass('pending')).toBe('status-pending');
    });

    test('should return "status-approved" for approved status', () => {
      expect(getApprovalStatusClass('approved')).toBe('status-approved');
    });

    test('should return "status-rejected" for rejected status', () => {
      expect(getApprovalStatusClass('rejected')).toBe('status-rejected');
    });

    test('should return empty string for unknown approval status', () => {
      expect(getApprovalStatusClass('unknown' as any)).toBe('');
    });
  });
});
