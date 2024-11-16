
import { config } from 'dotenv'
import jwt from 'jsonwebtoken'
import { expirationJWT,secretKeyJWT } from '~/constants';
config()

export const signToken = (action: { type: string; payload: { _id: string; user_role: string } }) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      action.payload,
      secretKeyJWT[action.type],
      { algorithm: 'HS256', expiresIn: expirationJWT[action.type] },
      function (err, token) {
        if (err) {
          reject(err)
        } else {
          resolve(token as string)
        }
      }
    )
  })
}