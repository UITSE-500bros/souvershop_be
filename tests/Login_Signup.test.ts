import { Request, Response } from 'express';
import AuthController from '../src/controllers/auth.controller';
import userService from '../src/services/user.service';
import bcrypt from 'bcrypt';
import { signToken } from '../src/utils/signToken';

jest.mock('../src/services/user.service', () => ({
  __esModule: true,
  default: {
    createUser: jest.fn(),
    getUserByEmail: jest.fn(),
    updateUserTokens: jest.fn(),
    getUserByID: jest.fn(),
    updateStatus: jest.fn()
  }
}));

jest.mock('../src/services/mail.service', () => ({
  __esModule: true,
  default: {
      sendVerifiedEmail: jest.fn()
  }
}));

jest.mock('bcrypt', () => ({
  genSaltSync: jest.fn().mockReturnValue('mocked_salt'),
  hashSync: jest.fn().mockReturnValue('hashed_password'),
  compare: jest.fn() 
}));

jest.mock('../src/utils/signToken', () => ({
  signToken: jest.fn()
}));

describe('AuthController - Register', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    mockRequest.body = { user_email: 'nguyenchilam259@gmail.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userService.createUser as jest.Mock).mockResolvedValue({ user_id: 'user_id', user_email: 'nguyenchilam259@gmail.com' });

    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Your account created sucessfully. Please check email to confirm registration' });
    expect(userService.createUser).toHaveBeenCalled();
    expect(userService.updateUserTokens).toHaveBeenCalled();
  });

  it('should return 400 if email or password is missing', async () => {
    mockRequest.body = { user_email: 'nguyenchilam259@gmail.com' };
    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
    expect(userService.createUser).not.toHaveBeenCalled();

    mockRequest.body = { user_password: 'password123' };
    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
    expect(userService.createUser).not.toHaveBeenCalled();

    mockRequest.body = {};
    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should return 400 if user already exists', async () => {
    mockRequest.body = { user_email: 'nguyenchilam259@gmail.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({ user_email: 'nguyenchilam259@gmail.com' });

    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User already exists' });
    expect(userService.createUser).not.toHaveBeenCalled();
  });

  it('should return 400 if error when creating user', async () => {
    mockRequest.body = { user_email: 'nguyenchilam259@gmail.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);
    (userService.createUser as jest.Mock).mockResolvedValue(null);

    await AuthController.register(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Error creating user' });
    expect(userService.updateUserTokens).not.toHaveBeenCalled();
  });
});

describe('AuthController - Login', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let cookieMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    cookieMock = jest.fn();

    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: statusMock,
      cookie: cookieMock
    };

    jest.clearAllMocks();
  });

  it('should login successfully with valid credentials and active status', async () => {
    mockRequest.body = { user_email: 'test@example.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({
      user_email: 'test@example.com',
      user_password: 'hashed_password',
      user_account_status: 'active',
      user_id: '123',
      user_role: 14
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock)
      .mockResolvedValueOnce('mocked_access_token') // First call for accessToken
      .mockResolvedValueOnce('mocked_refresh_token'); // Second call for refreshToken

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(signToken).toHaveBeenCalledTimes(2);
    expect(signToken).toHaveBeenNthCalledWith(1, { type: 'accessToken', payload: { _id: '123', user_role: 14 } });
    expect(signToken).toHaveBeenNthCalledWith(2, { type: 'refreshToken', payload: { _id: '123', user_role: 14 } });
    expect(userService.updateUserTokens).toHaveBeenCalledWith(
      {
        user_email: 'test@example.com',
        user_password: 'hashed_password',
        user_account_status: 'active',
        user_id: '123',
        user_role: 14
      },
      { accessToken: 'mocked_access_token', refreshToken: 'mocked_refresh_token' }
    );
    expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'mocked_refresh_token', { httpOnly: true, sameSite: 'none', secure: true });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ accessToken: 'mocked_access_token', refreshToken: 'mocked_refresh_token' });
  });

  it('should automatically update user status from "verified" to "active" on successful login', async () => {
    mockRequest.body = { user_email: 'verified@example.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({
      user_email: 'verified@example.com',
      user_password: 'hashed_password',
      user_account_status: 'verified',
      user_id: '456',
      user_role: 14
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock)
      .mockResolvedValueOnce('mocked_access_token')
      .mockResolvedValueOnce('mocked_refresh_token');

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.updateStatus).toHaveBeenCalledWith(
      {
        user_email: 'verified@example.com',
        user_password: 'hashed_password',
        user_account_status: 'verified',
        user_id: '456',
        user_role: 14
      },
      'active'
    );
    // Assertions to ensure login process continues after updating status
    expect(signToken).toHaveBeenCalledTimes(2);
    expect(userService.updateUserTokens).toHaveBeenCalled();
    expect(cookieMock).toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ accessToken: 'mocked_access_token', refreshToken: 'mocked_refresh_token' });
  });

  it('should return 400 if user does not exist', async () => {
    mockRequest.body = { user_email: 'nonexistent@example.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue(null);

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'User does not exist' });
  });

  it('should return 400 if password is incorrect', async () => {
    mockRequest.body = { user_email: 'test@example.com', user_password: 'wrongpassword' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({
      user_email: 'test@example.com',
      user_password: 'hashed_password',
      user_account_status: 'active',
      user_id: '123',
      user_role: 14
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', 'hashed_password');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should return 400 if user is not verified', async () => {
    mockRequest.body = { user_email: 'unverified@example.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({
      user_email: 'unverified@example.com',
      user_password: 'hashed_password',
      user_account_status: 'unverified',
      user_id: '789',
      user_role: 14
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('unverified@example.com');
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please verify your email' });
  });

  it('should return 400 if email is missing', async () => {
    mockRequest.body = { user_password: 'password123' };
    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
  });

  it('should return 400 if password is missing', async () => {
    mockRequest.body = { user_email: 'test@example.com' };
    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
  });

  it('should return 400 if both email and password are missing', async () => {
    mockRequest.body = {};
    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({ message: 'Please fill all fields' });
  });

  it('should login with nguyenchilam259@gmail.com and return access and refresh tokens', async () => {
    mockRequest.body = { user_email: 'nguyenchilam259@gmail.com', user_password: 'password123' };
    (userService.getUserByEmail as jest.Mock).mockResolvedValue({
      user_email: 'nguyenchilam259@gmail.com',
      user_password: 'hashed_password',
      user_account_status: 'active',
      user_id: '123',
      user_role: 14
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (signToken as jest.Mock)
      .mockResolvedValueOnce('mocked_access_token')
      .mockResolvedValueOnce('mocked_refresh_token');

    await AuthController.login(mockRequest as Request, mockResponse as Response);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('nguyenchilam259@gmail.com');
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashed_password');
    expect(signToken).toHaveBeenCalledTimes(2);
    expect(signToken).toHaveBeenNthCalledWith(1, { type: 'accessToken', payload: { _id: '123', user_role: 14 } });
    expect(signToken).toHaveBeenNthCalledWith(2, { type: 'refreshToken', payload: { _id: '123', user_role: 14 } });
    expect(userService.updateUserTokens).toHaveBeenCalledWith(
      {
        user_email: 'nguyenchilam259@gmail.com',
        user_password: 'hashed_password',
        user_account_status: 'active',
        user_id: '123',
        user_role: 14
      },
      { accessToken: 'mocked_access_token', refreshToken: 'mocked_refresh_token' }
    );
    expect(cookieMock).toHaveBeenCalledWith('refreshToken', 'mocked_refresh_token', { httpOnly: true, sameSite: 'none', secure: true });
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith({ accessToken: 'mocked_access_token', refreshToken: 'mocked_refresh_token' });
  });
});