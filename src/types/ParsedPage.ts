// types/notion.ts
export type ParsedPage = {
  id: string;
  slug?: string;
  title: string;
  status?: string;
  published?: boolean;
  excerpt?: string;
  content?: string;
  date?: string;
  rank?: number;
  btnText?: string;
  link?: string;
  imagePresentation?: string;
  images?: string[];
  created?: string;
  edited?: string;
};
