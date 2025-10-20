import { SignJWT, jwtVerify } from 'jose';
import { Response } from 'express';

const secretKey = process.env.JWT_SECRET || 'your-secret-key';
const key = new TextEncoder().encode(secretKey);

export interface SessionPayload {
  user_id: string;
  email: string;
  role: string;
  full_name: string;
  expires_at: number;
  [key: string]: any;
}

export async function encrypt(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  });
  return payload as unknown as SessionPayload;
}

export async function createSession(
  res: Response,
  user: {
    user_id: string;
    email: string;
    role: string;
    full_name: string;
  }
) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({
    user_id: user.user_id,
    email: user.email,
    role: user.role,
    full_name: user.full_name,
    expires_at: expires.getTime(),
  });

  res.cookie('session', session, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

export function deleteSession(res: Response) {
  res.cookie('session', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}


