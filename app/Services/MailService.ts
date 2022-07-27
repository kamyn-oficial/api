import Env from '@ioc:Adonis/Core/Env'
import { createTransport, Transporter } from 'nodemailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import inLineCss from 'nodemailer-juice'
import renderView from 'App/Views/renderView'
import { join } from 'path'

class MailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>
  private from: string
  private assetsPath: string

  constructor() {
    this.transporter = createTransport({
      host: Env.get('SMTP_HOST'),
      port: Env.get('SMTP_PORT'),
      secure: false,
      auth: {
        user: Env.get('SMTP_USER'),
        pass: Env.get('SMTP_PASSWORD')
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    if (!this.transporter) throw new Error('Transporter not created')

    this.transporter.use('compile', inLineCss())

    this.from = `Ecommerce <${Env.get('SMTP_USER')}>`

    this.assetsPath = join(__filename, '..', '..', 'Assets')
  }

  public async sendEmailForgotPassword(
    to: string,
    state: { name: string; redirectLink: string }
  ) {
    const html = await renderView('forgotPassword', state)

    await this.transporter.sendMail({
      subject: 'Redefinir Senha',
      from: this.from,
      to,
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: `${this.assetsPath}/logo.png`,
          cid: 'logo.png'
        }
      ]
    })
  }

  public async sendEmailConfirmation(
    to: string,
    state: { name: string; redirectLink: string }
  ) {
    const html = await renderView('confirmEmail', state)

    await this.transporter.sendMail({
      subject: 'Confirmar Email',
      from: this.from,
      to,
      html,
      attachments: [
        {
          filename: 'logo.png',
          path: `${this.assetsPath}/logo.png`,
          cid: 'logo.png'
        }
      ]
    })
  }
}

export default new MailService()
