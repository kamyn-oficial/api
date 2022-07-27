import Env from '@ioc:Adonis/Core/Env'
import jwt, { JwtPayload } from 'jsonwebtoken'

class JwtService {
  private JWT_KEY: string

  constructor() {
    this.JWT_KEY = Env.get('APP_KEY')
  }

  private createToken({
    expireInDays
  }: {
    expireInDays: number
  }): Promise<[string, number]> {
    return new Promise((resolve, reject) => {
      const oneDayInSeconds = 86400
      const expInTimestamp =
        new Date().getTime() + expireInDays * (oneDayInSeconds * 1000)

      jwt.sign(
        {},
        this.JWT_KEY,
        { expiresIn: `${expireInDays}d` },
        (err, token) => {
          if (err) reject(err)
          else resolve([token as string, expInTimestamp])
        }
      )
    })
  }

  public get accessToken() {
    return this.createToken({ expireInDays: 5 })
  }

  public get resetPasswordToken() {
    return this.createToken({ expireInDays: 1 })
  }

  public get confirmEmailToken() {
    return this.createToken({ expireInDays: 3 })
  }

  public tokenExpiration(token: string): Promise<number> {
    return new Promise(resolve => {
      jwt.verify(token, this.JWT_KEY, (_, payload: JwtPayload) =>
        resolve(payload?.exp || -1)
      )
    })
  }

  public tokenIsExpired(tokenExp: number): boolean {
    const currentTimestamp = new Date().getTime() / 1000
    const isExpired = tokenExp - currentTimestamp < 0

    return isExpired
  }
}

export default new JwtService()
