import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create response with cleared session cookie
    const response = NextResponse.json({ 
      message: 'Đăng xuất thành công' 
    })
    
    // Delete session cookie
    response.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
    
    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Lỗi khi đăng xuất' },
      { status: 500 }
    )
  }
}
