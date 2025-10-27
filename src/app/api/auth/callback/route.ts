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

    if (!code) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const ssoResponse = await validateSSOCode(code);

    if (!ssoResponse.status || !ssoResponse.data) {
      return NextResponse.redirect(new URL('/?error=sso_failed', request.url));
    }

    const ssoUser = ssoResponse.data;

    let user = await prisma.user.findUnique({
      where: { email: ssoUser.email }
    });

    if (!user) {
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

    const safeReturnUrl = isValidReturnUrl(returnUrl, request.url);
    const response = NextResponse.redirect(new URL(safeReturnUrl, request.url));

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

    return response;
  } catch (error) {
    console.error('SSO callback error:', error);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
