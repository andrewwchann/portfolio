export type AboutPhoto = {
  src: string;
  alt: string;
  caption?: string;
};

export type InlineLink = {
  text: string;
  href: string;
};

/** Plain paragraph or text with inline links */
export type ContentBlock = string | { parts: Array<string | InlineLink> };

export type Experience = {
  id: string;
  from: string;
  label: string;
  type: string;
  role: string;
  org: string;
  product?: {
    name: string;
    href: string;
    tagline?: string;
  };
  /** Each block becomes its own paragraph */
  description: ContentBlock[];
  tags: string[];
};

/** @deprecated Use ContentBlock */
export type AboutInlineLink = InlineLink;

/** @deprecated Use ContentBlock */
export type AboutBlock = ContentBlock;

/** An extra labeled, click-to-expand image (e.g. test results) */
export type ProjectImage = {
  src: string;
  label: string;
  caption?: string;
};

export type ProjectDetail = {
  /** Extended write-up — each string becomes its own paragraph */
  overview?: ContentBlock[];
  /** Bullet points — role, impact, key features */
  highlights?: string[];
  /** YouTube link or path to mp4/webm in /public */
  videoUrl?: string;
  /** Architecture diagram — path under /public, e.g. /projects/proj-1/architecture.png */
  architectureSrc?: string;
  architectureCaption?: string;
  /** Flow / process diagram */
  flowSrc?: string;
  flowCaption?: string;
  /** Additional labeled images (test results, screenshots, etc.) */
  images?: ProjectImage[];
};

export type Project = {
  id: string;
  /** URL-friendly identifier used for the project's dedicated page, e.g. "cyberus" → /projects/cyberus */
  slug?: string;
  title: string;
  description: string;
  github: string;
  demo?: string;
  tags: string[];
  /** Cover image shown on the project tile (path under /public) */
  image?: string;
  /** Optional visual treatment for the tile preview */
  tileFrame?: "phone";
  /** Short date range shown on the tile, e.g. "Apr – Jun 2026" */
  dates?: string;
  /** Pixel art or illustration that peeks from behind the card on hover */
  hoverArt?: string;
  detail?: ProjectDetail;
};
