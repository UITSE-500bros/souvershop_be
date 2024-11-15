import { config } from 'dotenv'
config()
const expirationJWT: {
  [key: string]: string
} = {
  forgotPassword: process.env.EXPIRE_FORGOT_PASSWORD as string,
  verifiedEmail: process.env.EXPIRE_VERIFY_EMAIL as string,
  refreshToken: process.env.EXPIRE_REFRESH_TOKEN as string,
  accessToken: process.env.EXPIRE_ACCESS_TOKEN as string
}
export default expirationJWT