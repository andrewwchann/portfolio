import type { ContentBlock } from "../data/types";
import ContentBlocks from "./ContentBlocks";

type AboutTextProps = {
  blocks: ContentBlock[];
};

export default function AboutText({ blocks }: AboutTextProps) {
  return <ContentBlocks blocks={blocks} className="about-text" />;
}
