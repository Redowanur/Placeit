import Image from "next/image";
import { Icon } from "@/components/icon";
import { Container } from "@/components/ui/container";
import { SearchBar } from "@/components/home/search-bar";
import { heroImage, heroStats } from "@/lib/data";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night-950 text-white">
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-night-950/90 via-night-950/70 to-night-950"
        aria-hidden="true"
      />

      <Container className="relative flex flex-col items-center pb-14 pt-12 text-center md:pb-20 md:pt-16 lg:pt-20">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl lg:text-[56px] lg:leading-[1.1]">
          Find Your Dream Job Today!
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-white/70 md:text-base md:leading-7">
          Connecting Talent With Opportunity: Your Gateway to Career Success
        </p>

        <SearchBar className="mt-10" />

        <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14">
          {heroStats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-3.5">
              <span className="grid size-12 place-items-center rounded-xl bg-primary-500 text-white">
                <Icon name={stat.icon} className="size-5" />
              </span>
              <span className="text-left">
                <span className="block font-display text-xl font-bold leading-6 md:text-2xl">
                  {stat.value}
                </span>
                <span className="block text-sm text-white/65">{stat.label}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
