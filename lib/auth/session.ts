import { NextRequest, NextResponse } from 'next/server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET || 'your-secret-key'
const key = new TextEncoder().encode(secretKey)

export interface SessionPayload extends Record<string, any> {
  user_id: string
  email: string
  role: string
  full_name: string
  expires_at: number
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload as SessionPayload
}

export async function createSession(user: {
  user_id: string
  email: string
  role: string
  full_name: string
}) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  const session = await encrypt({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    expires_at: expires.getTime(),
  })

  const cookieStore = cookies()
  cookieStore.set('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

export async function getSession() {
  const cookieStore = cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) return null

  try {
    return await decrypt(session)
  } catch (error) {
    return null
  }
}

export function deleteSession(response?: NextResponse) {
  if (response) {
    // Used in API routes or middleware where we have a response object
    response.cookies.set('session', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  } else {
    // Used in server components
    const cookieStore = cookies()
    cookieStore.set('session', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  try {
    const parsed = await decrypt(session)
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    
    const res = NextResponse.next()
    res.cookies.set({
      name: 'session',
      value: await encrypt({ ...parsed, expires_at: expires.getTime() }),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires,
    })
    
    return res
  } catch (error) {
    return NextResponse.next()
  }
}
