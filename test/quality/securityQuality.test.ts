import {
  valorBase,
  resultadoFinal,
  message,
  UserService,
  EmailNotificationService,
} from '../../src/quality/errores-object';
import {
  buildSecureUserQuery,
  escapeHtml,
  renderUserBox,
  verifyCsrfToken,
  parsePayloadSafely,
  secureHashPassword,
  logAuthError,
} from '../../src/quality/insecure-2-object';

describe('Quality and Security Module Remediations', () => {
  describe('errores-object remediations', () => {
    it('should have correct math and string conversions', () => {
      expect(valorBase).toBe(10);
      expect(resultadoFinal).toBe(20);
      expect(message).toBe('10');
      expect(typeof message).toBe('string');
    });

    it('should adhere to Single Responsibility Principle for UserService and EmailService', () => {
      const userService = new UserService();
      const user = userService.getUserData('u123');
      expect(user.id).toBe('u123');
      expect(user.email).toBe('usuario@duocuc.cl');

      const emailService = new EmailNotificationService();
      const sent = emailService.sendEmail('test@duocuc.cl', 'Bienvenida', 'Hola');
      expect(sent).toBe(true);
    });
  });

  describe('insecure-2-object remediations', () => {
    it('should prevent SQL Injection by creating parameterized query objects', () => {
      const maliciousInput = "admin'; DROP TABLE Users; --";
      const query = buildSecureUserQuery(maliciousInput);
      expect(query.query).toBe('SELECT id, username, email FROM Users WHERE username = ?');
      expect(query.params).toEqual([maliciousInput]);
    });

    it('should prevent XSS by escaping HTML entities', () => {
      const maliciousInput = '<script>alert("XSS");</script>';
      const safe = escapeHtml(maliciousInput);
      expect(safe).toBe('&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;');

      const boxed = renderUserBox(maliciousInput);
      expect(boxed).toBe('<div>&lt;script&gt;alert(&quot;XSS&quot;);&lt;/script&gt;</div>');
    });

    it('should enforce CSRF verification with timing-safe comparison', () => {
      const token = 'csrf-secret-token-12345';
      expect(verifyCsrfToken(token, token)).toBe(true);
      expect(verifyCsrfToken(token, 'invalid-token-12345')).toBe(false);
      expect(verifyCsrfToken(token, undefined)).toBe(false);
    });

    it('should safely parse JSON payloads defending against insecure deserialization', () => {
      const validJson = JSON.stringify({ name: 'Duoc', active: true });
      const parsed = parsePayloadSafely<{ name: string; active: boolean }>(validJson);
      expect(parsed).toEqual({ name: 'Duoc', active: true });

      const invalidJson = '{ bad json';
      expect(parsePayloadSafely(invalidJson)).toBeNull();
    });

    it('should securely hash passwords without exposing plaintext credentials in logs', () => {
      const hash1 = secureHashPassword('miPasswordSeguro');
      const hash2 = secureHashPassword('miPasswordSeguro');
      expect(typeof hash1).toBe('string');
      expect(hash1.length).toBeGreaterThan(10);
      expect(hash1).not.toBe('miPasswordSeguro');

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      logAuthError('estudiante1');
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Seguridad] Intento de autenticacion fallido')
      );
      consoleSpy.mockRestore();
    });
  });
});
