"use server"

import {
  readServices as readServicesFromFile,
  writeServices as writeServicesToFile,
  readWorkshops as readWorkshopsFromFile,
  writeWorkshops as writeWorkshopsToFile,
  readBestPractices as readBestPracticesFromFile,
  writeBestPractices as writeBestPracticesToFile,
  readResources as readResourcesFromFile,
  writeResources as writeResourcesToFile,
  readMailConfig as readMailConfigFromFile,
  writeMailConfig as writeMailConfigToFile,
  readLandingPage as readLandingPageFromFile,
  writeLandingPage as writeLandingPageToFile,
  initializeFileSystemDB as initFileSystemDB,
  resetFileSystemDB as resetFileSystemDBFunc,
} from "./fs-db"

import type { IService } from "@/types/service"
import type { IWorkshop } from "@/types/workshop"
import type { IBestPractice } from "@/types/best-practice"
import type { IResource } from "@/types/resource"
import type { IMailConfig } from "@/types/mail-config"
import type { ILandingPageData } from "@/types/landing-page"

// Server-Aktionen für die Dateisystem-Datenbank
export async function getServicesFromFileSystem(defaultServices: IService[]): Promise<IService[]> {
  return readServicesFromFile(defaultServices)
}

export async function saveServicesToFileSystem(services: IService[]): Promise<boolean> {
  return writeServicesToFile(services)
}

export async function getWorkshopsFromFileSystem(defaultWorkshops: IWorkshop[]): Promise<IWorkshop[]> {
  return readWorkshopsFromFile(defaultWorkshops)
}

export async function saveWorkshopsToFileSystem(workshops: IWorkshop[]): Promise<boolean> {
  return writeWorkshopsToFile(workshops)
}

export async function getBestPracticesFromFileSystem(defaultBestPractices: IBestPractice[]): Promise<IBestPractice[]> {
  return readBestPracticesFromFile(defaultBestPractices)
}

export async function saveBestPracticesToFileSystem(bestPractices: IBestPractice[]): Promise<boolean> {
  return writeBestPracticesToFile(bestPractices)
}

export async function getResourcesFromFileSystem(defaultResources: IResource[]): Promise<IResource[]> {
  return readResourcesFromFile(defaultResources)
}

export async function saveResourcesToFileSystem(resources: IResource[]): Promise<boolean> {
  return writeResourcesToFile(resources)
}

export async function getMailConfigFromFileSystem(defaultMailConfig: IMailConfig): Promise<IMailConfig> {
  return readMailConfigFromFile(defaultMailConfig)
}

export async function saveMailConfigToFileSystem(mailConfig: IMailConfig): Promise<boolean> {
  return writeMailConfigToFile(mailConfig)
}

export async function getLandingPageFromFileSystem(defaultLandingPage: ILandingPageData): Promise<ILandingPageData> {
  return readLandingPageFromFile(defaultLandingPage)
}

export async function saveLandingPageToFileSystem(landingPage: ILandingPageData): Promise<boolean> {
  return writeLandingPageToFile(landingPage)
}

export async function initializeFileSystemDB(defaultData: {
  services: IService[]
  workshops: IWorkshop[]
  bestPractices: IBestPractice[]
  resources: IResource[]
  mailConfig: IMailConfig
  landingPage: ILandingPageData
}): Promise<boolean> {
  return initFileSystemDB(defaultData)
}

export async function resetFileSystemDB(defaultData: {
  services: IService[]
  workshops: IWorkshop[]
  bestPractices: IBestPractice[]
  resources: IResource[]
  mailConfig: IMailConfig
  landingPage: ILandingPageData
}): Promise<boolean> {
  return resetFileSystemDBFunc(defaultData)
}
