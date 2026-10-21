import { Container } from "@/components/ui/container";
import { LinkArrow, SectionHeader } from "@/components/ui/section-header";
import { JobCard } from "@/components/home/job-card";
import { jobs, jobsIntro } from "@/lib/data";

export function FeaturedJobs() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <SectionHeader
          align="left"
          title="Recent Jobs Available"
          description={jobsIntro}
          action={<LinkArrow href="/jobs" className="hidden md:inline-flex">View all</LinkArrow>}
        />

        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <LinkArrow href="/jobs">View all</LinkArrow>
        </div>
      </Container>
    </section>
  );
}
