import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/icon";
import { promoImage } from "@/lib/data";

export function CompanyPromo() {
  return (
    <section className="py-14 md:py-20">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[10/9] overflow-hidden rounded-[28px] bg-surface">
          <Image
            src={promoImage.src}
            alt={promoImage.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>

        <div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight text-heading md:text-4xl lg:text-[40px] lg:leading-[1.2]">
            Good Life Begins With A Good Company
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-7 text-body md:text-base">
            Ultrices purus dolor semper in laoreet et lacus ut. Ultrices purus
            diam egestas dignissim mi egestas. Gravida tellusidunt consectetur
            diam morbi est viverra. Vulputate pellentesque feugiat euismod
            feugiat blandit ultricies.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Button href="/jobs" icon="search">
              Search Job
            </Button>
            <a
              href="/about"
              className="group inline-flex items-center gap-2 font-display text-sm font-semibold text-heading underline-offset-4 transition-colors hover:text-primary-600 hover:underline"
            >
              Learn more
              <Icon
                name="arrow-right"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
