import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const admin = await authenticateAdmin(email, password);

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin',
      },
    });
    // Set lightweight session cookies (dev/demo). For production, use httpOnly secure cookies or JWT.
    res.cookies.set('session_role', 'admin', {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });
    res.cookies.set('session_email', admin.email, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });
    res.cookies.set('session_user', JSON.stringify({ id: admin.id, email: admin.email, name: admin.name, role: 'admin' }), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
    });
    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
