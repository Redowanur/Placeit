import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SaveJobButton } from "@/components/home/save-job-button";
import type { Job } from "@/lib/data";

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-colors hover:border-primary-200 md:p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs font-semibold text-primary-600">{job.posted}</p>
        <SaveJobButton label={job.title} />
      </div>

      <div className="mt-2 flex items-center gap-4">
        <span
          className="grid size-12 shrink-0 place-items-center rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: job.logo.color }}
          aria-hidden="true"
        >
          {job.logo.initials}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-heading transition-colors group-hover:text-primary-600">
            <Link href="/jobs">{job.title}</Link>
          </h3>
          <p className="mt-0.5 truncate text-sm text-body">{job.company}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <ul className="flex flex-wrap items-center gap-2">
          <li>
            <Badge icon="building">{job.category}</Badge>
          </li>
          <li>
            <Badge icon="clock">{job.type}</Badge>
          </li>
          <li>
            <Badge icon="dollar-sign">{job.salary}</Badge>
          </li>
          <li>
            <Badge icon="map-pin">{job.location}</Badge>
          </li>
        </ul>
        <Button href="/jobs" size="sm" className="w-full md:w-auto">
          Job Details
        </Button>
      </div>
    </article>
  );
}
