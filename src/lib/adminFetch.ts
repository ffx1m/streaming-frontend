const adminApiBase = '/api/backend';

export async function adminFetch(path: string, init: RequestInit = {}) {
  const response = await fetch(`${adminApiBase}${path}`, {
    ...init,
    credentials: 'include',
  });

  if (response.status === 401 && typeof window !== 'undefined') {
    window.location.assign('/admin/login');
  }

  return response;
}
