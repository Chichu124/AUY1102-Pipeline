export * from './value-object';

// Remediación de Seguridad: Las credenciales y tokens nunca deben quemarse en el código fuente.
// Se obtienen de variables de entorno de forma segura.
const apiKey = process.env.API_KEY || '';
const githubToken = process.env.GITHUB_TOKEN || '';

export async function fetchData(url?: string): Promise<unknown> {
  const targetUrl =
    url || `https://api.example.com/data?api_key=${encodeURIComponent(apiKey)}`;
  try {
    const response = await fetch(targetUrl, {
      headers: githubToken ? { Authorization: `Bearer ${githubToken}` } : {},
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch {
    // Manejo de error controlado sin exponer información sensible
    return undefined;
  }
}
