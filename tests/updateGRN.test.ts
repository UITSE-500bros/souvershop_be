import { Request, Response } from 'express';
import grnController from '../src/controllers/grn.controller';
import GRNService from '../src/services/grn.service';
import GRN from '../src/models/grn.model';

jest.mock('../src/services/grn.service', () => ({
  __esModule: true,
  default: {
    updateGRN: jest.fn(),
    getGRNById: jest.fn(),
  },
}));

describe('GRNController - updateGRN', () => {
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

  it('should update GRN successfully within 15 minutes', async () => {
    const grnId = 'grn123';
    const total = 1000;
    const productList = [{ product_id: 'p1', quantity: 10 }];
    const updatedGRN: Partial<GRN> = { grn_id: grnId, total, product_list: productList, create_at: new Date() };
    (GRNService.getGRNById as jest.Mock).mockResolvedValue({ created_at: new Date() });
    (GRNService.updateGRN as jest.Mock).mockResolvedValue(updatedGRN);

    mockRequest.params = { grn_id: grnId };
    mockRequest.body = { total, product_list: productList };

    await grnController.updateGRN(mockRequest as Request, mockResponse as Response);

    expect(GRNService.getGRNById).toHaveBeenCalledWith(grnId);
    expect(GRNService.updateGRN).toHaveBeenCalledWith(grnId, total, productList);
    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalledWith(updatedGRN);
  });

  it('should return 403 if GRN is older than 15 minutes', async () => {
    const grnId = 'grn123';
    const total = 1000;
    const productList = [{ product_id: 'p1', quantity: 10 }];
    const fifteenMinutesAgo = new Date(Date.now() - 16 * 60 * 1000); // 16 minutes ago
    (GRNService.getGRNById as jest.Mock).mockResolvedValue({ created_at: fifteenMinutesAgo });

    mockRequest.params = { grn_id: grnId };
    mockRequest.body = { total, product_list: productList };

    await grnController.updateGRN(mockRequest as Request, mockResponse as Response);

    expect(GRNService.getGRNById).toHaveBeenCalledWith(grnId);
    expect(GRNService.updateGRN).not.toHaveBeenCalled();
    expect(statusMock).toHaveBeenCalledWith(403);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'GRN can only be edited within 15 minutes of creation' });
  });

  it('should return 404 if GRN not found', async () => {
    const grnId = 'invalidGRN';
    const total = 1000;
    const productList = [{ product_id: 'p1', quantity: 10 }];
    (GRNService.getGRNById as jest.Mock).mockResolvedValue({ created_at: new Date() });
    (GRNService.updateGRN as jest.Mock).mockRejectedValue(new Error('GRN not found'));

    mockRequest.params = { grn_id: grnId };
    mockRequest.body = { total, product_list: productList };

    await grnController.updateGRN(mockRequest as Request, mockResponse as Response);

    expect(GRNService.getGRNById).toHaveBeenCalledWith(grnId);
    expect(GRNService.updateGRN).toHaveBeenCalledWith(grnId, total, productList);
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'GRN not found' });
  });

  it('should handle database error', async () => {
    const grnId = 'grn123';
    const total = 1000;
    const productList = [{ product_id: 'p1', quantity: 10 }];
    (GRNService.getGRNById as jest.Mock).mockResolvedValue({ created_at: new Date() });
    (GRNService.updateGRN as jest.Mock).mockRejectedValue(new Error('Database error'));

    mockRequest.params = { grn_id: grnId };
    mockRequest.body = { total, product_list: productList };

    await grnController.updateGRN(mockRequest as Request, mockResponse as Response);

    expect(GRNService.getGRNById).toHaveBeenCalledWith(grnId);
    expect(GRNService.updateGRN).toHaveBeenCalledWith(grnId, total, productList);
    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith({ error: 'Database error' });
  });
});