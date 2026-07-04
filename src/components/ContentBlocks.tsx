import type { ContentBlock } from "../data/types";
import { asset } from "../utils/asset";

type ContentBlocksProps = {
  blocks: ContentBlock[];
  className?: string;
};

function blockKey(block: ContentBlock, index: number) {
  if (typeof block === "string") return block.slice(0, 24) || String(index);
  return block.parts
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("")
    .slice(0, 24);
}

export default function ContentBlocks({
  blocks,
  className = "content-blocks",
}: ContentBlocksProps) {
  const resolveHref = (href: string) => (href.startsWith("/#") ? asset(href) : href);

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        if (typeof block === "string") {
          return <p key={blockKey(block, index)}>{block}</p>;
        }

        return (
          <p key={blockKey(block, index)}>
            {block.parts.map((part, partIndex) =>
              typeof part === "string" ? (
                part
              ) : (
                <a key={`${partIndex}-${part.href}`} href={resolveHref(part.href)}>
                  {part.text}
                </a>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}
