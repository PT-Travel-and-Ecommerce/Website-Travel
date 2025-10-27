import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userSession = cookieStore.get('user_session');

    if (!userSession) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = JSON.parse(userSession.value);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error fetching user session:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
