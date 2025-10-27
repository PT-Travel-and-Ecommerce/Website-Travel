export interface SSOUser {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  phoneNumber: string | null;
}

export interface SSOValidateResponse {
  status: boolean;
  message?: string;
  data?: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

export async function validateSSOCode(code: string): Promise<SSOValidateResponse> {
  try {
    const response = await fetch(`https://ssoauth.darulgs.co.id/api/example/ssovalidate?code=${code}`);
    
    if (!response.ok) {
      return { status: false };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('SSO validation error:', error);
    return { status: false };
  }
}

export function getCurrentUser(): SSOUser | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cookie = document.cookie.split('; ').find(c => c.startsWith('user_email='));
    if (!cookie) return null;
    
    const email = decodeURIComponent(cookie.split('=')[1] || '');
    if (email) {
      return { 
        id: '', 
        email, 
        name: null, 
        username: null, 
        phoneNumber: null 
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<SSOUser | null> {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.user || null;
  } catch {
    return null;
  }
}

export function redirectToSSO(returnUrl?: string): void {
  if (typeof window === 'undefined') return;
  
  const baseUrl = window.location.origin;
  const callbackUrl = `${baseUrl}/auth/callback`;
  const redirectUrl = returnUrl ? `${callbackUrl}?returnUrl=${encodeURIComponent(returnUrl)}` : callbackUrl;
  
  console.log('SSO Redirect - Base URL:', baseUrl);
  console.log('SSO Redirect - Callback URL:', callbackUrl);
  console.log('SSO Redirect - Full Redirect URL:', redirectUrl);
  
  window.location.href = `https://ssoauth.darulgs.co.id/login?redirectUrl=${encodeURIComponent(redirectUrl)}`;
}

export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  
  try {
    document.cookie = 'user_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'user_email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch {}
}
