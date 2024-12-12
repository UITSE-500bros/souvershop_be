import moment from 'moment'
import { Request, Response } from 'express'
import qs from 'qs'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

function sortObject(obj: { [key: string]: any }): { [key: string]: string } {
  const sorted: { [key: string]: string } = {};
  const keys: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(encodeURIComponent(key));
    }
  }

  keys.sort();

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    sorted[key] = encodeURIComponent(obj[decodeURIComponent(key)]).replace(/%20/g, "+");
  }

  return sorted;
}
class ReceiptController {
  async createPaymentIntent(req: Request, res: Response) { 

  }
  // VNPAY with card
  async createPaymentUrl(req: Request, res: Response) {
    try {
      process.env.TZ = 'Asia/Ho_Chi_Minh'
      const date = new Date()
      const createDate = moment(date).format('YYYYMMDDHHmmss')
      const ipAddr = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress;
      const tmnCode: string = process.env.VNP_TMN_CODE
      const secretKey: string = process.env.VNP_HASH_SECRET
      const vnpUrl: string = process.env.VNP_URL
      const returnUrl: string = process.env.VNP_RETURN_URL
      const orderId = moment(date).format('DDHHmmss')
      const amount: number = req.body.amount;
      if ( amount < 5000) {
        return res.status(404).json("The amount must be larger than 5000 vnd")
      }
      const bankCode: string = req.body.bankCode
      let locale: string = req.body.language
      if (!locale) {
        locale = 'vn'
      }
      const currCode = 'VND'
      const vnp_Params: Record<string, string | number> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate
      }
      if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode
      }
      const sortedParams = sortObject(vnp_Params)
      const signData = qs.stringify(sortedParams, { encode: false })
      const hmac = crypto.createHmac('sha512', secretKey)
      const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex')
      sortedParams['vnp_SecureHash'] = signed
      const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;
      
      return res.status(200).json(paymentUrl);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
  async getReturn(req: Request, res: Response) {
    const vnp_Params = req.query;
    // Lấy vnp_SecureHash và loại bỏ để kiểm tra chữ ký
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params as Record<string, string>);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET as string);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      res.send('Payment success');
    } else {
      res.send('Invalid signature');
    }
  }

  //VNPAY with qrcode

}
const receiptController = new ReceiptController()
export default receiptController;