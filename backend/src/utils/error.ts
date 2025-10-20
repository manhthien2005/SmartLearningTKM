import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const status = err?.statusCode || 500;
  const message = err?.message || 'Internal Server Error';
  
  // Log error with context
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      statusCode: status,
      isOperational: err.isOperational,
    },
    request: {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
  });

  // Don't leak error details in production for 500 errors
  const response = {
    message: status === 500 && process.env.NODE_ENV === 'production' 
      ? 'Internal Server Error' 
      : message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(status).json(response);
}
