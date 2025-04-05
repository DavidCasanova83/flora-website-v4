import { Client } from "@notionhq/client";
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
  ListBlockChildrenResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Récupération de l'ID de la base de données depuis .env
const databaseId = import.meta.env.NOTION_DATABASE_ID as string;
const notion = new Client({ auth: import.meta.env.NOTION_SECRET });

// 🔍 Fonction pour récupérer toutes les pages publiées dans la database Notion
export async function getPages(): Promise<PageObjectResponse[]> {
  const response: QueryDatabaseResponse = await notion.databases.query({
    database_id: databaseId,
  });

  // On filtre pour ne garder que les pages complètes (avec properties)
  const pages = response.results.filter(
    (page): page is PageObjectResponse =>
      page.object === "page" && "properties" in page
  );

  return pages;
}

// 🔍 Fonction pour récupérer tous les blocs de contenu d'une page Notion
export async function getPageContent(
  pageId: string
): Promise<ListBlockChildrenResponse["results"]> {
  let allBlocks: ListBlockChildrenResponse["results"] = [];
  let cursor: string | undefined = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      start_cursor: cursor,
    });
    allBlocks.push(...response.results);
    cursor = response.next_cursor ?? undefined;
  } while (cursor);

  return allBlocks;
}
