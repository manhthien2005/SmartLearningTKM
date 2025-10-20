import { Request, Response, NextFunction } from 'express';
import { decrypt } from '../utils/session';

export interface AuthRequest extends Request {
  user?: {
    user_id: string;
    email: string;
    role: string;
    full_name: string;
  };
}

export async function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.session;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const session = await decrypt(token);
    req.user = {
      user_id: session.user_id,
      email: session.email,
      role: session.role,
      full_name: session.full_name,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


