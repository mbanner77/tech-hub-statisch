import { neon } from "@neondatabase/serverless"
import type { Content, PageContent, ContentSearchParams } from "@/types/content-management"

// Verbindung zur Datenbank herstellen
const sql = neon(process.env.DATABASE_URL!)

// Tabellen erstellen, falls sie nicht existieren
export async function initContentTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS content_categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      parent_id TEXT REFERENCES content_categories(id)
    );

    CREATE TABLE IF NOT EXISTS content_items (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      key TEXT NOT NULL,
      data JSONB NOT NULL,
      category TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(key, type)
    );

    CREATE TABLE IF NOT EXISTS page_contents (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      path TEXT NOT NULL UNIQUE,
      data JSONB NOT NULL,
      is_published BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
}

// Content-Item speichern
export async function saveContentItem(content: Content): Promise<Content> {
  const now = new Date().toISOString()

  if (!content.id) {
    content.id = crypto.randomUUID()
    content.createdAt = now
  }

  content.updatedAt = now

  if (content.type === "page") {
    const pageContent = content as PageContent
    await sql`
      INSERT INTO page_contents (id, key, title, path, data, is_published, updated_at)
      VALUES (${pageContent.id}, ${pageContent.key}, ${pageContent.title}, ${pageContent.path}, ${JSON.stringify(pageContent)}, ${pageContent.isPublished}, ${now})
      ON CONFLICT (id) DO UPDATE
      SET key = ${pageContent.key}, title = ${pageContent.title}, path = ${pageContent.path}, 
          data = ${JSON.stringify(pageContent)}, is_published = ${pageContent.isPublished}, updated_at = ${now}
    `
  } else {
    await sql`
      INSERT INTO content_items (id, type, key, data, category, updated_at)
      VALUES (${content.id}, ${content.type}, ${(content as any).key}, ${JSON.stringify(content)}, ${(content as any).category}, ${now})
      ON CONFLICT (id) DO UPDATE
      SET type = ${content.type}, key = ${(content as any).key}, data = ${JSON.stringify(content)}, 
          category = ${(content as any).category}, updated_at = ${now}
    `
  }

  return content
}

// Content-Item abrufen
export async function getContentItem(id: string): Promise<Content | null> {
  // Zuerst in content_items suchen
  const contentItems = await sql<Content[]>`
    SELECT data FROM content_items WHERE id = ${id}
  `

  if (contentItems.length > 0) {
    return contentItems[0]
  }

  // Dann in page_contents suchen
  const pageContents = await sql<PageContent[]>`
    SELECT data FROM page_contents WHERE id = ${id}
  `

  if (pageContents.length > 0) {
    return pageContents[0]
  }

  return null
}

// Content-Item nach Schlüssel abrufen
export async function getContentByKey(key: string, type: string): Promise<Content | null> {
  if (type === "page") {
    const pages = await sql<PageContent[]>`
      SELECT data FROM page_contents WHERE key = ${key}
    `

    if (pages.length > 0) {
      return pages[0]
    }
  } else {
    const items = await sql<Content[]>`
      SELECT data FROM content_items WHERE key = ${key} AND type = ${type}
    `

    if (items.length > 0) {
      return items[0]
    }
  }

  return null
}

// Content-Items nach Kategorie abrufen
export async function getContentByCategory(category: string): Promise<Content[]> {
  const items = await sql<Content[]>`
    SELECT data FROM content_items WHERE category = ${category}
  `

  return items
}

// Alle Seiteninhalte abrufen
export async function getAllPages(includeUnpublished = false): Promise<PageContent[]> {
  if (includeUnpublished) {
    const pages = await sql<PageContent[]>`
      SELECT data FROM page_contents
    `
    return pages
  } else {
    const pages = await sql<PageContent[]>`
      SELECT data FROM page_contents WHERE is_published = true
    `
    return pages
  }
}

// Seiteninhalt nach Pfad abrufen
export async function getPageByPath(path: string): Promise<PageContent | null> {
  const pages = await sql<PageContent[]>`
    SELECT data FROM page_contents WHERE path = ${path}
  `

  if (pages.length > 0) {
    return pages[0]
  }

  return null
}

// Content-Item löschen
export async function deleteContentItem(id: string): Promise<boolean> {
  // Zuerst versuchen, aus content_items zu löschen
  const contentResult = await sql`
    DELETE FROM content_items WHERE id = ${id} RETURNING id
  `

  if (contentResult.length > 0) {
    return true
  }

  // Dann versuchen, aus page_contents zu löschen
  const pageResult = await sql`
    DELETE FROM page_contents WHERE id = ${id} RETURNING id
  `

  return pageResult.length > 0
}

// Content-Items suchen
export async function searchContent(params: ContentSearchParams): Promise<Content[]> {
  const { type, key, category, query, page = 1, limit = 20 } = params
  const offset = (page - 1) * limit

  const conditions = []
  const queryParams: any[] = []

  if (type) {
    conditions.push(`type = $${queryParams.length + 1}`)
    queryParams.push(type)
  }

  if (key) {
    conditions.push(`key LIKE $${queryParams.length + 1}`)
    queryParams.push(`%${key}%`)
  }

  if (category) {
    conditions.push(`category = $${queryParams.length + 1}`)
    queryParams.push(category)
  }

  if (query) {
    conditions.push(`data::text ILIKE $${queryParams.length + 1}`)
    queryParams.push(`%${query}%`)
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  const items = await sql<Content[]>`
    SELECT data FROM content_items ${whereClause}
    ORDER BY updated_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return items
}
