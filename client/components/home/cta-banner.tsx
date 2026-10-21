import Image from "next/image";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ctaImage } from "@/lib/data";

export function CtaBanner() {
  return (
    <section className="pb-14 md:pb-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-[28px] bg-night-950 text-white">
          <span
            className="absolute -left-16 -top-16 -z-10 size-64 rounded-full bg-primary-500/25 blur-3xl"
            aria-hidden="true"
          />

          <div className="grid md:grid-cols-2">
            <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14">
              <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                Create A Better Future For Yourself
              </h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-white/65 md:text-[15px]">
                At eu lobortis pretium tincidunt amet lacus ut senectus amet.
                Blandit a massa elementum id ad suspendisse morbi.
              </p>
              <div className="mt-8">
                <Button href="/jobs" icon="search">
                  Search Job
                </Button>
              </div>
            </div>

            <div className="relative h-56 md:h-auto md:min-h-[300px]">
              <Image
                src={ctaImage.src}
                alt={ctaImage.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-r from-night-950 via-night-950/30 to-transparent"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
