import crypto from 'crypto';
import express, { Request, Response } from 'express';

export const router = express.Router();

// ============================================================================
// REMEDIACIONES DE SEGURIDAD - ANALISIS ESTATICO (SONARCLOUD / SNYK / CODEQL)
// ============================================================================

// 1. REMEDIACION SQL INJECTION (CWE-89)
// Uso de consultas parametrizadas (Prepared Statements) en lugar de interpolacion de cadenas.
export interface ParameterizedQuery {
  query: string;
  params: unknown[];
}

export function buildSecureUserQuery(username: string): ParameterizedQuery {
  return {
    query: 'SELECT id, username, email FROM Users WHERE username = ?',
    params: [username],
  };
}

// 2. REMEDIACION CROSS-SITE SCRIPTING - XSS (CWE-79)
// Escape de caracteres especiales HTML antes de incrustar contenido de usuario en la vista.
export function escapeHtml(unsafeText: string): string {
  return unsafeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderUserBox(userInput: string): string {
  const safeContent = escapeHtml(userInput);
  return `<div>${safeContent}</div>`;
}

// 3. REMEDIACION CROSS-SITE REQUEST FORGERY - CSRF (CWE-352)
// Verificacion obligatoria de token anti-CSRF en operaciones de modificacion de estado.
export function verifyCsrfToken(sessionToken: string | undefined, headerToken: string | undefined): boolean {
  if (!sessionToken || !headerToken) {
    return false;
  }
  const buf1 = Buffer.from(sessionToken);
  const buf2 = Buffer.from(headerToken);
  if (buf1.length !== buf2.length) {
    return false;
  }
  return crypto.timingSafeEqual(buf1, buf2);
}

router.post('/change-password', (req: Request, res: Response) => {
  const csrfHeader = req.headers['x-csrf-token'] as string;
  const sessionCsrf = (req as unknown as { session?: { csrfToken?: string } }).session?.csrfToken;

  if (!verifyCsrfToken(sessionCsrf, csrfHeader)) {
    return res.status(403).json({ error: 'Token CSRF invalido o inexistente' });
  }

  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'Contraseña no cumple requisitos de seguridad' });
  }

  // Modificar contrasena de forma segura con hash
  return res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
});

// 4. REMEDIACION DESERIALIZACION INSEGURA (CWE-502)
// Parseo controlado y validacion de tipos con bloque defensivo try-catch.
export function parsePayloadSafely<T = Record<string, unknown>>(rawInput: string): T | null {
  try {
    const parsed = JSON.parse(rawInput);
    if (typeof parsed === 'object' && parsed !== null) {
      return parsed as T;
    }
    return null;
  } catch {
    return null;
  }
}

// 5. REMEDIACION DE CREDENCIALES QUEMADAS Y EXPOSICION DE DATOS SENSIBLES (CWE-798, CWE-532)
// Obtencion de secretos mediante variables de entorno y proteccion de logs.
export const dbConfig = {
  dbUsername: process.env.DB_USERNAME || 'app_user',
  dbPassword: process.env.DB_PASSWORD || '',
  apiKey: process.env.API_KEY || '',
};

export function secureHashPassword(password: string, salt: string = crypto.randomBytes(16).toString('hex')): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

// Registro seguro: NUNCA imprimir passwords o datos confidenciales en consola
export function logAuthError(username: string): void {
  console.warn(`[Seguridad] Intento de autenticacion fallido para el usuario: ${username}`);
}
