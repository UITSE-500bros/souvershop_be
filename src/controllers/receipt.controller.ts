import moment from 'moment'
import { Request, Response } from 'express'
import qs from 'qs'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()

// Helper function to sort the parameters object
function sortObject(obj: Record<string, any>): Record<string, any> {
  const sorted: Record<string, any> = {}
  const keys = Object.keys(obj).sort()
  for (const key of keys) {
    sorted[key] = obj[key]
  }
  return sorted
}
class ReceiptController {
  async createPaymentIntent(req: Request, res: Response) {}
  async createPaymentUrl(req: Request, res: Response) {
    try {
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        const date = new Date()
        const createDate = moment(date).format('YYYYMMDDHHmmss')

        const ipAddr =
          (req.headers['x-forwarded-for'] as string) ||
          req.socket.remoteAddress 


        const tmnCode: string = process.env.VNP_TMN_CODE
        const secretKey: string = process.env.VNP_HASH_SECRET
        const vnpUrl: string = process.env.VNP_URL
        const returnUrl: string = process.env.VNP_RETURN_URL
        const orderId = moment(date).format('DDHHmmss')
        const amount: number = req.body.amount
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

        const paymentUrl = `${vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`
        res.redirect(paymentUrl)
      } catch (error) {

      }
  }
}
const receiptController = new ReceiptController()
export default receiptController;
