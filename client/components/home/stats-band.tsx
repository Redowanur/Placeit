import { Container } from "@/components/ui/container";
import { promoStats } from "@/lib/data";

export function StatsBand() {
  return (
    <section className="pb-8 md:pb-12">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6">
          {promoStats.map((stat) => (
            <li key={stat.label}>
              <p className="font-display text-3xl font-bold text-primary-500 md:text-4xl">
                {stat.value}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold text-heading">
                {stat.label}
              </h3>
              <p className="mt-2 max-w-xs text-sm leading-6 text-body">
                At eu lobortis pretium tincidunt amet lacus ut senectus amet.
                Blandit a massa elementum id ut.
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
