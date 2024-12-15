import { Request, Response } from 'express';
import profileController from '../src/controllers/profile.controller';
import profileService from '../src/services/profile.service';
import User from '../src/models/user.model';

// Mock profileService
jest.mock('../src/services/profile.service', () => ({
  __esModule: true,
  default: {
    updateName: jest.fn(),
    updateAvatar: jest.fn(),
  },
}));

describe('ProfileController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockRequest = {
      params: {},
      body: {},
    };
    mockResponse = {
      status: statusMock,
    };
    jest.clearAllMocks();
  });

  describe('updateName', () => {
    it('should update user name successfully', async () => {
      const userId = 'user123';
      const newName = 'New Name';
      const updatedUser: Partial<User> = { user_id: userId, user_name: newName };
      (profileService.updateName as jest.Mock).mockResolvedValue(updatedUser);

      mockRequest.params = { user_id: userId };
      mockRequest.body = { user_name: newName };

      await profileController.updateName(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateName).toHaveBeenCalledWith(userId, newName);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 404 if user not found', async () => {
      const userId = 'invalidUser';
      const newName = 'New Name';
      (profileService.updateName as jest.Mock).mockRejectedValue(new Error('User not found'));

      mockRequest.params = { user_id: userId };
      mockRequest.body = { user_name: newName };

      await profileController.updateName(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateName).toHaveBeenCalledWith(userId, newName);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle database error', async () => {
      const userId = 'user123';
      const newName = 'New Name';
      (profileService.updateName as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest.params = { user_id: userId };
      mockRequest.body = { user_name: newName };

      await profileController.updateName(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateName).toHaveBeenCalledWith(userId, newName);
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });

  describe('updateAvatar', () => {
    it('should update user avatar successfully', async () => {
      const userId = 'user123';
      const mockFile = {
        buffer: Buffer.from('avatar data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      const updatedUser: Partial<User> = { user_id: userId, user_avatar: 'https://example.com/avatar.jpg' };
      (profileService.updateAvatar as jest.Mock).mockResolvedValue(updatedUser);

      mockRequest.params = { user_id: userId };
      mockRequest.file = mockFile;

      await profileController.updateAvatar(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateAvatar).toHaveBeenCalledWith(userId, mockFile);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedUser);
    });

    it('should return 400 if no file uploaded', async () => {
      const userId = 'user123';
      mockRequest.params = { user_id: userId };

      await profileController.updateAvatar(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateAvatar).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No file uploaded' });
    });

    it('should handle upload error', async () => {
      const userId = 'user123';
      const mockFile = {
        buffer: Buffer.from('avatar data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      (profileService.updateAvatar as jest.Mock).mockRejectedValue(new Error('Upload error'));

      mockRequest.params = { user_id: userId };
      mockRequest.file = mockFile;

      await profileController.updateAvatar(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateAvatar).toHaveBeenCalledWith(userId, mockFile);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Upload error' });
    });

    it('should return 500 if user not found', async () => {
      const userId = 'invalidUser';
      const mockFile = {
        buffer: Buffer.from('avatar data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      (profileService.updateAvatar as jest.Mock).mockRejectedValue(new Error('User not found'));

      mockRequest.params = { user_id: userId };
      mockRequest.file = mockFile;

      await profileController.updateAvatar(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateAvatar).toHaveBeenCalledWith(userId, mockFile);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'User not found' });
    });

    it('should handle database error', async () => {
      const userId = 'user123';
      const mockFile = {
        buffer: Buffer.from('avatar data'),
        mimetype: 'image/jpeg',
      } as Express.Multer.File;
      (profileService.updateAvatar as jest.Mock).mockRejectedValue(new Error('Database error'));

      mockRequest.params = { user_id: userId };
      mockRequest.file = mockFile;

      await profileController.updateAvatar(mockRequest as Request, mockResponse as Response);

      expect(profileService.updateAvatar).toHaveBeenCalledWith(userId, mockFile);
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
    });
  });
});