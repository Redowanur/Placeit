import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { jobCategories, locations } from "@/lib/data";
import { Button } from "@/components/ui/button";

const fieldClass =
  "h-11 w-full appearance-none rounded-xl bg-transparent text-sm font-medium text-heading outline-none focus-visible:ring-2 focus-visible:ring-primary-400/40 md:rounded-none";

function FieldShell({
  children,
  className,
  bordered = true,
}: {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-line px-3 focus-within:border-primary-400 md:h-14 md:flex-1 md:rounded-none md:border-0",
        bordered && "md:border-l md:border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

function SelectField({
  name,
  placeholder,
  options,
  bordered = true,
}: {
  name: string;
  placeholder: string;
  options: string[];
  bordered?: boolean;
}) {
  return (
    <FieldShell className="relative pr-2" bordered={bordered}>
      <select name={name} className={cn(fieldClass, "cursor-pointer pr-6 text-body")} defaultValue="">
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute right-3 size-4 text-muted md:right-4"
      />
    </FieldShell>
  );
}

export function SearchBar({ className }: { className?: string }) {
  return (
    <form
      action="/jobs"
      method="get"
      className={cn(
        "mx-auto w-full max-w-4xl rounded-2xl bg-white p-3 text-left shadow-2xl shadow-night-950/30 md:p-2.5",
        className,
      )}
    >
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-0">
        <FieldShell bordered={false} className="md:pl-5 md:pr-4">
          <label htmlFor="hero-job-title" className="sr-only">
            Job title or company
          </label>
          <input
            id="hero-job-title"
            name="title"
            type="text"
            placeholder="Job Title, Company"
            className={cn(fieldClass, "placeholder:font-medium placeholder:text-heading/60")}
          />
        </FieldShell>

        <SelectField name="location" placeholder="Select Location" options={locations} />
        <SelectField name="category" placeholder="Select Category" options={jobCategories} bordered />

        <div className="md:p-2">
          <Button icon="search" type="submit" className="w-full md:w-auto">
            Search Job
          </Button>
        </div>
      </div>
    </form>
  );
}
