import { Author, Project, PROJECT_BY_ID_QUERYResult, PROJECT_QUERYResult, Slug } from "@/sanity/types";

export type ProjectCardType = Omit<
  Project,
  "author" | "_type" | "_updatedAt" | "_rev" | "title" | "slug" | "views" | "description" | "image" | "pitch"
> & {
  author?: Author | null;
  title: string | null;
  slug: Slug | null;
  views: number | null;
  description: string | null;
  image: string | null;
};
