"use server"

import nodemailer from "nodemailer"
import type { MailConfig } from "@/types/mail-config"

export interface SendEmailProps {
  to: string
  subject: string
  html: string
}

// Füge die defaultMailConfig hinzu und exportiere sie
export const defaultMailConfig: MailConfig = {
  enabled: false,
  host: "",
  port: "587",
  secure: false,
  auth: {
    user: "",
    pass: "",
  },
  defaultFrom: "",
}

export const sendEmail = async ({
  to,
  subject,
  html,
}: SendEmailProps): Promise<{ success: boolean; error?: string }> => {
  try {
    const mailConfigString = process.env.MAIL_CONFIG
    if (!mailConfigString) {
      throw new Error("MAIL_CONFIG environment variable is not set.")
    }

    const mailConfig: MailConfig = JSON.parse(mailConfigString)

    if (!mailConfig.enabled) {
      console.warn("E-Mail sending is disabled in the configuration.")
      return { success: true }
    }

    const transporter = nodemailer.createTransport({
      host: mailConfig.host,
      port: Number.parseInt(mailConfig.port, 10),
      secure: mailConfig.secure,
      auth: {
        user: mailConfig.auth.user,
        pass: mailConfig.auth.pass,
      },
    })

    const mailOptions = {
      from: mailConfig.defaultFrom,
      to: to,
      subject: subject,
      html: html,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error: any) {
    console.error("Fehler beim Senden der E-Mail:", error)
    return { success: false, error: error.message }
  }
}

export async function getMailConfig(): Promise<MailConfig> {
  try {
    const mailConfigString = process.env.MAIL_CONFIG
    if (!mailConfigString) {
      console.warn("MAIL_CONFIG environment variable is not set.")
      return defaultMailConfig
    }

    const mailConfig: MailConfig = JSON.parse(mailConfigString)
    return mailConfig
  } catch (error) {
    console.error("Fehler beim Abrufen der Mail-Konfiguration:", error)
    return defaultMailConfig
  }
}

export async function saveMailConfig(config: MailConfig): Promise<boolean> {
  try {
    process.env.MAIL_CONFIG = JSON.stringify(config)
    return true
  } catch (error) {
    console.error("Fehler beim Speichern der Mail-Konfiguration:", error)
    return false
  }
}

export async function testMailConfig(
  config: MailConfig,
  testEmail: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!config.enabled) {
      return { success: false, error: "E-Mail sending is disabled." }
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: Number.parseInt(config.port, 10),
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    })

    const mailOptions = {
      from: config.defaultFrom,
      to: testEmail,
      subject: "Test E-Mail",
      html: "<p>Dies ist eine Test-E-Mail, um die Mail-Konfiguration zu überprüfen.</p>",
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error: any) {
    console.error("Fehler beim Senden der Test-E-Mail:", error)
    return { success: false, error: error.message }
  }
}
