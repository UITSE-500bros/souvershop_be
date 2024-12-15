import { Request, Response, NextFunction } from 'express';
import authRouter from '../src/routes/auth.route';
import express from 'express';
import request from 'supertest';

const app = express();

const mockAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  req.logout = jest.fn().mockImplementation((options, callback) => {
    if (typeof options === 'function') {
      callback = options;
    }
    callback(null);
  });
  req.session = {
    destroy: jest.fn().mockImplementation(callback => callback()),
  } as any;
  next();
};

app.use(mockAuthMiddleware); 
app.use('/', authRouter);

describe('Auth Route - /logout', () => {
  it('should logout successfully', async () => {
    const response = await request(app)
      .get('/logout')
      .set('Cookie', 'connect.sid=some_value'); 

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Logout successful' });
    expect(response.headers['set-cookie']).toEqual([
      'connect.sid=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ]);
  });

  it('should return 500 if session destroy fails', async () => {
    // Override req.session.destroy to simulate an error
    const mockDestroy = jest.fn().mockImplementation(cb => cb(new Error('Session destroy error')));
    const appWithSessionError = express();
    appWithSessionError.use((req: Request, res: Response, next: NextFunction) => {
      req.logout = jest.fn().mockImplementation((options, callback) => {
        if (typeof options === 'function') {
          callback = options;
        }
        callback(null); 
      });
      req.session = { destroy: mockDestroy } as any;
      next();
    });
    appWithSessionError.use('/', authRouter);

    const response = await request(appWithSessionError).get('/logout');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Session destroy failed' });
  });
});