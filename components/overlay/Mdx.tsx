import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "./mdx-components";

const prettyCode: PrettyCodeOptions = {
  theme: "synthwave-84",
  keepBackground: false,
  defaultLang: { block: "text", inline: "text" },
};

export function Mdx({ source }: { source: string }) {
  return (
    <div className="text-base">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCode]],
          },
        }}
      />
    </div>
  );
}
