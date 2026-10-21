import { Hero } from "@/components/home/hero";
import { BrandsStrip } from "@/components/home/brands-strip";
import { FeaturedJobs } from "@/components/home/featured-jobs";
import { BrowseCategories } from "@/components/home/browse-categories";
import { CompanyPromo } from "@/components/home/company-promo";
import { StatsBand } from "@/components/home/stats-band";
import { CtaBanner } from "@/components/home/cta-banner";
import { Testimonials } from "@/components/home/testimonials";
import { NewsAndBlog } from "@/components/home/news-blog";

export default function HomePage() {
  return (
    <>
      <Hero />
      <BrandsStrip />
      <FeaturedJobs />
      <BrowseCategories />
      <CompanyPromo />
      <StatsBand />
      <CtaBanner />
      <Testimonials />
      <NewsAndBlog />
    </>
  );
}
