import { ITokenPayload } from '@/modules/users/interfaces/user.interface';
import { Request } from 'express';
import session from 'express-session';

export interface IExceptionResponse {
  message: string;
  error?: string;
  statusCode?: number;
  details?: any;
}

export interface IRequestWithUser extends Request {
  user?: ITokenPayload;
  traceId: string;
}

export interface IRequestWithSession extends Request {
  session: session.Session & Partial<session.SessionData>;
}
