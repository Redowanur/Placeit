import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="text-4xl">That page doesn't exist</h1>
      <p className="mt-3 text-muted">The link may be old, or the address may have a typo.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Back to the home page
      </Link>
    </div>
  );
}
