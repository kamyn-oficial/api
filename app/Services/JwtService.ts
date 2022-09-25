import Env from '@ioc:Adonis/Core/Env'
import jwt, { JwtPayload } from 'jsonwebtoken'

class JwtService {
  private JWT_KEY: string

  constructor() {
    this.JWT_KEY = Env.get('APP_KEY')
  }

  private createToken({
    userId,
    expireInDays
  }: {
    userId?: string
    expireInDays: number
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(
        {
          userId
        },
        this.JWT_KEY,
        { expiresIn: `${expireInDays}d` },
        (err, token) => {
          if (err) reject(err)
          else resolve(String(token))
        }
      )
    })
  }

  public accessToken(userId: string) {
    return this.createToken({ userId, expireInDays: 5 })
  }

  public get resetPasswordToken() {
    return this.createToken({ expireInDays: 1 })
  }

  public get confirmEmailToken() {
    return this.createToken({ expireInDays: 3 })
  }

  public payload(token: string): Promise<JwtPayload> {
    return new Promise(resolve => {
      jwt.verify(token, this.JWT_KEY, (_, payload: JwtPayload) =>
        resolve(payload)
      )
    })
  }

  public async tokenIsExpired(token: string): Promise<boolean> {
    const tokenExp = (await this.payload(token))?.exp || -1
    const currentTimestamp = new Date().getTime() / 1000
    const isExpired = tokenExp - currentTimestamp < 0

    return isExpired
  }
}

export default new JwtService()
