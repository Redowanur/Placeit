import { cn } from "@/lib/utils";

/**
 * Monochrome simplified recreations of well-known brand marks.
 * All are `fill: currentColor` so the surrounding text color applies.
 */
const brandMarks: Record<string, React.ReactNode> = {
  Spotify: (
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.36-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.9-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.302 1zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.18.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.561.3z" />
  ),
  slack: (
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.528 2.528 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
  ),
  Adobe: (
    <path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z" />
  ),
  asana: (
    <>
      <circle cx="12" cy="6.4" r="4.6" />
      <circle cx="5.4" cy="17.2" r="4.6" />
      <circle cx="18.6" cy="17.2" r="4.6" />
    </>
  ),
  Linear: (
    <g transform="rotate(-45 12 12)">
      <rect x="14.5" y="4.8" width="6" height="2.4" rx="1.2" />
      <rect x="10.5" y="8.3" width="10" height="2.4" rx="1.2" />
      <rect x="6.5" y="11.8" width="14" height="2.4" rx="1.2" />
      <rect x="2.5" y="15.3" width="18" height="2.4" rx="1.2" />
    </g>
  ),
};

export function BrandsStrip() {
  return (
    <section aria-label="Trusted by leading companies" className="border-b border-line bg-white py-9 md:py-11">
      <ul className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-7 px-4 sm:justify-between sm:gap-x-0 sm:px-6 lg:px-8">
        {Object.entries(brandMarks).map(([name, mark]) => (
          <li key={name}>
            <span
              className={cn(
                "flex items-center gap-2.5 text-heading opacity-80 transition-opacity hover:opacity-100",
                name === "slack" || name === "asana"
                  ? "text-lg font-bold tracking-tight"
                  : "text-xl font-semibold tracking-tight",
              )}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
                {mark}
              </svg>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
