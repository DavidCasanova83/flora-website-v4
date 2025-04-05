import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ParsedPage } from "../types/ParsedPage";

export function mapPageData(page: PageObjectResponse): ParsedPage {
  const props = page.properties;

  const getUrlFromFile = (file: any) => file?.external?.url ?? file?.file?.url;

  return {
    id: page.id,
    title: props.Page?.title?.[0]?.plain_text ?? "Sans titre",
    slug: props.Slug?.rich_text?.[0]?.plain_text,
    status: props.Status?.multi_select?.[0]?.name,
    published: props.Published?.checkbox ?? false,
    excerpt: props.Excerpt?.rich_text?.[0]?.plain_text,
    content: props.Contenu?.rich_text?.map((b) => b.plain_text).join("\n\n"),
    date: props.Date?.date?.start?.split("T")[0],
    rank: props.Rank?.number ?? null,
    btnText: props.Btn_text?.rich_text?.[0]?.plain_text,
    link: props.Lien?.url ?? null,
    imagePresentation: getUrlFromFile(props.ImagePresentation?.files?.[0]),
    images: props.Images?.files?.map(getUrlFromFile),
    created: page.created_time?.split("T")[0],
    edited: page.last_edited_time?.split("T")[0],
  };
}
