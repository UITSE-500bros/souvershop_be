import { Request, Response } from 'express';
import receiptController from '../src/controllers/receipt.controller';
import dotenv from 'dotenv';

dotenv.config();

describe('ReceiptController - createPaymentUrl', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));
    mockRequest = {
      body: {},
      headers: {},
    };
    mockResponse = {
      status: statusMock,
    };
    jest.clearAllMocks();
  });

  it('should create payment URL successfully with valid amount', async () => {
    mockRequest.body = { amount: 10000, products: [{ product_id: '1', quantity: 2 }] };
    mockRequest.headers = { 'x-forwarded-for': '192.168.1.1' };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalled();

    const paymentUrl = jsonMock.mock.calls[0][0];
    const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);

    expect(paymentUrl).toContain(process.env.VNP_URL);
    // Check if urlParams.get('vnp_Amount') is not null before parsing
    const vnpAmount = urlParams.get('vnp_Amount');
    if (vnpAmount !== null) {
      expect(parseInt(vnpAmount)).toBe(10000 * 100);
    } else {
      fail('vnp_Amount should not be null');
    }
    expect(urlParams.get('vnp_OrderInfo')).toContain(JSON.stringify(mockRequest.body.products));
  });

  it('should create payment URL successfully with bank code', async () => {
    mockRequest.body = { amount: 20000, bankCode: 'NCB', products: [{ productId: '1', quantity: 2 }] };
    mockRequest.headers = { 'x-forwarded-for': '192.168.1.1' };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalled();

    const paymentUrl = jsonMock.mock.calls[0][0];
    const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);

    expect(urlParams.get('vnp_BankCode')).toBe('NCB');
  });

  it('should create payment URL successfully with specified language', async () => {
    mockRequest.body = { amount: 15000, language: 'en', products: [{ productId: '1', quantity: 2 }] };
    mockRequest.headers = { 'x-forwarded-for': '192.168.1.1' };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalled();

    const paymentUrl = jsonMock.mock.calls[0][0];
    const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);

    expect(urlParams.get('vnp_Locale')).toBe('en');
  });

  it('should create payment URL successfully with default language (vn)', async () => {
    mockRequest.body = { amount: 12000, products: [{ productId: '1', quantity: 2 }] };
    mockRequest.headers = { 'x-forwarded-for': '192.168.1.1' };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalled();

    const paymentUrl = jsonMock.mock.calls[0][0];
    const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);

    expect(urlParams.get('vnp_Locale')).toBe('vn');
  });

  it('should return 404 if amount is less than 5000', async () => {
    mockRequest.body = { amount: 4000 };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(404);
    expect(jsonMock).toHaveBeenCalledWith('The amount must be larger than 5000 vnd');
  });

  it('should create payment URL successfully with valid amount', async () => {
    mockRequest.body = { amount: 10000, products: [{ productId: '1', quantity: 2 }] };
    mockRequest.headers = { 'x-forwarded-for': '192.168.1.1' };

    await receiptController.createPaymentUrl(mockRequest as Request, mockResponse as Response);

    expect(statusMock).toHaveBeenCalledWith(200);
    expect(jsonMock).toHaveBeenCalled();

    const paymentUrl = jsonMock.mock.calls[0][0];
    const urlParams = new URLSearchParams(paymentUrl.split('?')[1]);

    expect(paymentUrl).toContain(process.env.VNP_URL);
    // Check if urlParams.get('vnp_Amount') is not null before parsing
    const vnpAmount = urlParams.get('vnp_Amount');
    if (vnpAmount !== null) {
      expect(parseInt(vnpAmount)).toBe(10000 * 100);
    } else {
      fail('vnp_Amount should not be null');
    }
    expect(urlParams.get('vnp_OrderInfo')).toContain(JSON.stringify(mockRequest.body.products));
  });
});