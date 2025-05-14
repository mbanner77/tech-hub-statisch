"use server"

import { getMailConfig, saveMailConfig, testMailConfig } from "./mail-service"
import type { MailConfig } from "@/types/mail-config"

export async function getMailConfigAction(): Promise<MailConfig> {
  return getMailConfig()
}

export async function saveMailConfigAction(config: MailConfig): Promise<boolean> {
  return saveMailConfig(config)
}

export async function testMailConfigAction(
  config: MailConfig,
  testEmail: string,
): Promise<{ success: boolean; error?: string }> {
  return testMailConfig(config, testEmail)
}
