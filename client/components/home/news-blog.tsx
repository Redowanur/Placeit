import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { LinkArrow, SectionHeader } from "@/components/ui/section-header";
import { PillBadge } from "@/components/ui/badge";
import { blogIntro, posts } from "@/lib/data";

function BlogCard({ post }: { post: (typeof posts)[number] }) {
  return (
    <article className="group">
      <Link
        href="/"
        className="relative block aspect-[16/10] overflow-hidden rounded-2xl bg-surface"
      >
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <PillBadge className="absolute left-4 top-4">{post.badge}</PillBadge>
      </Link>

      <p className="mt-5 text-xs font-medium text-muted">{post.date}</p>
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-heading transition-colors group-hover:text-primary-600">
        <Link href="/">{post.title}</Link>
      </h3>
      <LinkArrow href="/" className="mt-3">
        Read more
      </LinkArrow>
    </article>
  );
}

export function NewsAndBlog() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <SectionHeader
          align="left"
          title="News and Blog"
          description={blogIntro}
          action={<LinkArrow href="/" className="hidden md:inline-flex">View all</LinkArrow>}
        />

        <div className="grid gap-8 md:grid-cols-2 md:gap-6">
          {posts.map((post) => (
            <BlogCard key={post.badge} post={post} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <LinkArrow href="/">View all</LinkArrow>
        </div>
      </Container>
    </section>
  );
}
