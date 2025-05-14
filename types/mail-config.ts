export interface MailConfig {
  enabled: boolean
  host: string
  port: string
  secure: boolean
  auth: {
    user: string
    pass: string
  }
  defaultFrom: string
}
