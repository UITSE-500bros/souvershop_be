import { config } from 'dotenv'
config()
export const secretKeyJWT: {
  [key: string]: string
} = {
  forgotPassword: process.env.FORGOT_PASSWORD_SECRET as string,
  verifiedEmail: process.env.EMAIL_SECRET_HASH as string,
  refreshToken: process.env.REFRESH_TOKEN_SECRET as string,
  accessToken: process.env.ACCESS_TOKEN_SECRET as string
}