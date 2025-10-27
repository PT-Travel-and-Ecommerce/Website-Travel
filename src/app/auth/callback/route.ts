import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface SSOValidateResponse {
  status: boolean;
  message?: string;
  data?: {
    id: string;
    username: string;
    email: string;
    phone: string;
  };
}

async function validateSSOCode(code: string): Promise<SSOValidateResponse> {
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

function isValidReturnUrl(returnUrl: string | null, requestUrl: string): string {
  if (!returnUrl) return '/';
  
  try {
    if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      return returnUrl;
    }
    
    const requestHost = new URL(requestUrl).host;
    const returnUrlObj = new URL(returnUrl);
    
    if (returnUrlObj.host === requestHost) {
      return returnUrl;
    }
    
    return '/';
  } catch {
    return '/';
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const returnUrl = searchParams.get('returnUrl');

    console.log('SSO Callback - Code:', code);
    console.log('SSO Callback - ReturnUrl:', returnUrl);

    // Get the correct hostname from headers (for servers binding to 0.0.0.0)
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
    const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol.replace(':', '')) || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    console.log('Base URL for redirect:', baseUrl);

    if (!code) {
      console.log('No code provided, redirecting to home');
      return NextResponse.redirect(new URL('/', baseUrl));
    }

    console.log('Validating SSO code...');
    const ssoResponse = await validateSSOCode(code);
    console.log('SSO Response:', ssoResponse);

    if (!ssoResponse.status || !ssoResponse.data) {
      console.log('SSO validation failed');
      return NextResponse.redirect(new URL('/?error=sso_failed', baseUrl));
    }

    const ssoUser = ssoResponse.data;
    console.log('SSO User:', ssoUser);

    let user = await prisma.user.findUnique({
      where: { email: ssoUser.email }
    });

    if (!user) {
      console.log('Creating new user...');
      user = await prisma.user.create({
        data: {
          email: ssoUser.email,
          username: ssoUser.username,
          phoneNumber: ssoUser.phone,
          ssoUserId: parseInt(ssoUser.id),
          lastLogin: new Date(),
        }
      });
    } else {
      console.log('Updating existing user...');
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLogin: new Date(),
          username: ssoUser.username,
          phoneNumber: ssoUser.phone,
          ssoUserId: parseInt(ssoUser.id),
        }
      });
    }

    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      phoneNumber: user.phoneNumber,
    };

    const safeReturnUrl = isValidReturnUrl(returnUrl, baseUrl);
    console.log('Safe Return URL:', safeReturnUrl);
    
    const response = NextResponse.redirect(new URL(safeReturnUrl, baseUrl));

    response.cookies.set('user_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    response.cookies.set('user_email', user.email, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    console.log('Login successful, redirecting to:', safeReturnUrl);
    return response;
  } catch (error) {
    console.error('SSO callback error:', error);
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host;
    const protocol = request.headers.get('x-forwarded-proto') || (request.nextUrl.protocol.replace(':', '')) || 'http';
    const baseUrl = `${protocol}://${host}`;
    return NextResponse.redirect(new URL('/?error=server_error', baseUrl));
  }
}
