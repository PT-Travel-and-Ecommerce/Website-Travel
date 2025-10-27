export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function loginAdmin(email: string, password: string): Promise<{ success: boolean; error?: string; user?: AdminUser }> {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (data?.success && data?.user && typeof window !== 'undefined') {
      try {
        localStorage.setItem('adminSession', JSON.stringify(data.user));
      } catch {}
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'An error occurred during login' };
  }
}

export async function registerAdmin(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('/api/admin/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An error occurred during registration' };
  }
}

export async function logoutAdmin(): Promise<void> {
  // Clear session/cookies here if needed
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminSession');
    try {
      // expire cookies set by API
      document.cookie = 'session_role=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'session_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'session_user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    } catch {}
  }
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  // This would need proper session management with cookies/JWT
  // For now, return null as placeholder
  if (typeof window === 'undefined') return null;
  // Try localStorage first
  try {
    const raw = localStorage.getItem('adminSession');
    if (raw) {
      const user = JSON.parse(raw) as AdminUser;
      if (user && user.id && user.email && user.role === 'admin') {
        return user;
      }
    }
  } catch {}

  // Fallback to cookie
  try {
    const cookie = document.cookie.split('; ').find(c => c.startsWith('session_user='));
    if (!cookie) return null;
    const value = decodeURIComponent(cookie.split('=')[1] || '');
    const user = JSON.parse(value) as AdminUser;
    if (user && user.id && user.email && user.role === 'admin') {
      return user;
    }
    return null;
  } catch {
    return null;
  }
}
