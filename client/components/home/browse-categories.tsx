import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Icon } from "@/components/icon";
import { categories, jobsIntro } from "@/lib/data";

export function BrowseCategories() {
  return (
    <section className="bg-surface py-14 md:py-20">
      <Container>
        <SectionHeader title="Browse by Category" description={jobsIntro} />

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <li key={category.name}>
              <Link
                href="/jobs"
                className="group flex h-full flex-col items-center rounded-2xl bg-white px-6 py-8 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <Icon
                  name={category.icon}
                  strokeWidth={1.7}
                  className="size-9 text-heading transition-colors group-hover:text-primary-600"
                />
                <span className="mt-4 font-display text-base font-semibold text-heading">
                  {category.name}
                </span>
                <span className="mt-1 text-sm text-body">{category.jobs} Jobs</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
