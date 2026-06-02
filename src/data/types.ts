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

/** @deprecated Use ContentBlock */
export type AboutInlineLink = InlineLink;

/** @deprecated Use ContentBlock */
export type AboutBlock = ContentBlock;

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
};

export type Project = {
  id: string;
  title: string;
  description: string;
  github: string;
  demo?: string;
  tags: string[];
  detail?: ProjectDetail;
};
