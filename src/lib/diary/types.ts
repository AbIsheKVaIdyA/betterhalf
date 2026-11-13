export type MediaType = "image" | "video";

export type MediaItem = {
  type: MediaType;
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  width?: number;
  height?: number;
};

export type ChapterId =
  | "how-we-met"
  | "first-adventures"
  | "favorite-places"
  | "today-and-forever";

export type Chapter = {
  id: ChapterId;
  title: string;
  subtitle: string;
};

export type PhotoLayout = "single" | "collage" | "grid" | "stack" | "split";

export type ReactionId = "soft" | "warm" | "again" | "favorite" | "laugh";

export type ReactionCounts = Partial<Record<ReactionId, number>>;

export type Memory = {
  id: string;
  date: string;
  title: string;
  location: string;
  story: string;
  media: MediaItem[];
  chapter: ChapterId;
  layout?: PhotoLayout;
  tagline?: string;
  mood?: string;
  tags?: string[];
  reactions?: ReactionCounts;
  song?: string;
  quote?: string;
  createdAt?: string;
};

export type SiteConfig = {
  herName: string;
  yourName: string;
  coupleName: string;
  startDate: string;
  welcomeTagline: string;
  heroHeadline: string;
  heroSubline: string;
  gate: {
    enabled: boolean;
    password: string;
    question: string;
    answer: string;
    hint: string;
  };
  footerLine: string;
};

export type DiaryData = {
  site: SiteConfig;
  chapters: Chapter[];
  entries: Memory[];
};

export type GalleryItem = MediaItem & {
  id: string;
  memoryId: string;
  memoryTitle: string;
  date: string;
  chapter: ChapterId;
  location: string;
};

export type NewEntryInput = {
  date: string;
  title: string;
  location: string;
  story: string;
  chapter: ChapterId;
  layout?: PhotoLayout;
  tagline?: string;
  mood?: string;
  tags?: string[];
  song?: string;
  quote?: string;
  media: MediaItem[];
  password: string;
};
