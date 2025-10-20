import morgan from 'morgan';
import logger, { httpLogStream } from '../utils/logger';

// Custom format for morgan (use built-in response-time token)
const morganFormat = process.env.NODE_ENV === 'development'
  ? ':method :url :status :response-time ms - :res[content-length]'
  : ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

export const requestLogger = morgan(morganFormat, {
  stream: httpLogStream,
  skip: (req) => {
    // Skip health check logs in production
    return process.env.NODE_ENV === 'production' && req.url === '/health';
  },
});

