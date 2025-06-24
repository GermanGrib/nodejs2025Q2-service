import { UserPayload } from '../auth/types';

declare module 'express' {
  export interface Request {
    user?: UserPayload;
    headers: Record<string, string>;
  }
}
