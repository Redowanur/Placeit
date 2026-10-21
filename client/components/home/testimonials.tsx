import Image from "next/image";
import { Icon } from "@/components/icon";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { testimonials, jobsIntro } from "@/lib/data";

function TestimonialCard({ testimonial }: { testimonial: (typeof testimonials)[number] }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card md:p-7">
      <div className="flex gap-1 text-star" aria-label="Rated 5 out of 5 stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon key={index} name="star" className="size-4" />
        ))}
      </div>

      <h3 className="mt-4 font-display text-xl font-semibold text-heading">
        {testimonial.title}
      </h3>
      <blockquote className="mt-3 flex-1 text-sm leading-6 text-body">
        {testimonial.quote}
      </blockquote>

      <figcaption className="mt-6 flex items-end justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative size-11 shrink-0 overflow-hidden rounded-full bg-surface ring-2 ring-primary-100">
            <Image
              src={testimonial.avatar}
              alt={testimonial.name}
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <span>
            <span className="block text-sm font-semibold text-heading">
              {testimonial.name}
            </span>
            <span className="block text-xs text-muted">{testimonial.role}</span>
          </span>
        </div>
        <Icon name="quote" className="size-7 shrink-0 text-primary-200" />
      </figcaption>
    </figure>
  );
}

export function Testimonials() {
  return (
    <section className="bg-surface py-14 md:py-20">
      <Container>
        <SectionHeader
          title="Testimonials from Our Customers"
          description={jobsIntro}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  );
}
