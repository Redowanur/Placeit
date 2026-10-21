import type { IconName } from "@/components/icon";

/* ---------------------------------- */
/* Navigation                         */
/* ---------------------------------- */

export type NavLink = { label: string; href: string; active?: boolean };

export const navLinks: NavLink[] = [
  { label: "Home", href: "/", active: true },
  { label: "Jobs", href: "/jobs" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

/* ---------------------------------- */
/* Hero                               */
/* ---------------------------------- */

export const heroImage = {
  src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
  alt: "",
};

export type HeroStat = { icon: IconName; value: string; label: string };

export const heroStats: HeroStat[] = [
  { icon: "briefcase", value: "23,850", label: "Jobs" },
  { icon: "users", value: "10,250", label: "Candidates" },
  { icon: "building", value: "18,400", label: "Companies" },
];

export const locations = [
  "New York, USA",
  "Los Angeles, USA",
  "Texas, USA",
  "Florida, USA",
  "Boston, USA",
];

export const jobCategories = [
  "Telecommunications",
  "Hotels & Tourism",
  "Media",
  "Construction",
  "Education",
  "Financial Services",
  "Commerce",
];

/* ---------------------------------- */
/* Featured jobs                      */
/* ---------------------------------- */

export type Job = {
  id: number;
  title: string;
  company: string;
  posted: string;
  category: string;
  type: string;
  salary: string;
  location: string;
  logo: { initials: string; color: string };
};

export const jobs: Job[] = [
  {
    id: 1,
    title: "Forex Security Director",
    company: "Bank, Shipping and Industrial Co",
    posted: "15 min ago",
    category: "Hotels & Tourism",
    type: "Full time",
    salary: "$60000 - $70000",
    location: "New York, USA",
    logo: { initials: "T", color: "#e23a2f" },
  },
  {
    id: 2,
    title: "Regional Creative Facilitator",
    company: "Microsoft, UK",
    posted: "18 min ago",
    category: "Media",
    type: "Part time",
    salary: "$80000 - $150000",
    location: "Los Angeles, USA",
    logo: { initials: "M", color: "#0f6cbd" },
  },
  {
    id: 3,
    title: "Internal Integration Planner",
    company: "Music, Quirky and Fresh Inc.",
    posted: "24 min ago",
    category: "Construction",
    type: "Full time",
    salary: "$60000 - $95000",
    location: "Texas, USA",
    logo: { initials: "G", color: "#7c3aed" },
  },
  {
    id: 4,
    title: "District Intranet Director",
    company: "Vonlalaundry - Irish Co.",
    posted: "32 min ago",
    category: "Facilities Service",
    type: "Full time",
    salary: "$45000 - $64000",
    location: "Florida, USA",
    logo: { initials: "IBM", color: "#1f70c1" },
  },
  {
    id: 5,
    title: "Corporate Tactics Facilitator",
    company: "Loydmark - UX Co.",
    posted: "41 min ago",
    category: "Commerce",
    type: "Full time",
    salary: "$30000 - $85000",
    location: "Boston, USA",
    logo: { initials: "M", color: "#8a1538" },
  },
];

export const jobsIntro =
  "At eu lobortis pretium tincidunt amet lacus ut senectus amet. Blandit a massa elementum id ut.";

/* ---------------------------------- */
/* Categories                         */
/* ---------------------------------- */

export type Category = { name: string; jobs: number; icon: IconName };

export const categories: Category[] = [
  { name: "Agriculture", jobs: 254, icon: "leaf" },
  { name: "Metal Production", jobs: 354, icon: "factory" },
  { name: "Commerce", jobs: 2002, icon: "shopping-bag" },
  { name: "Construction", jobs: 3320, icon: "hard-hat" },
  { name: "Hotels & Tourism", jobs: 1622, icon: "bed" },
  { name: "Education", jobs: 1582, icon: "graduation-cap" },
  { name: "Financial Services", jobs: 1520, icon: "landmark" },
  { name: "Transport", jobs: 2344, icon: "car" },
];

/* ---------------------------------- */
/* Company promo                      */
/* ---------------------------------- */

export const promoImage = {
  src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  alt: "Team collaborating in a modern office",
};

export type PromoStat = { value: string; label: string };

export const promoStats: PromoStat[] = [
  { value: "12k+", label: "Clients worldwide" },
  { value: "20k+", label: "Active resume" },
  { value: "18k+", label: "Companies" },
];

export const ctaImage = {
  src: "https://images.unsplash.com/photo-1529156069898-49953e1b1ac8?auto=format&fit=crop&w=1200&q=80",
  alt: "Happy professionals celebrating success",
};

/* ---------------------------------- */
/* Testimonials                       */
/* ---------------------------------- */

export type Testimonial = {
  title: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    title: "Amazing services",
    quote:
      "Morbi faucibus arcu turpis feugiat consequat. Phasellus sed hend risus ac dolor eu. Mal aliquam et bibendum tincidunt.",
    name: "Marcus Kuhn",
    role: "Product Manager",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2.5&w=96&h=96&q=80",
  },
  {
    title: "Everything simple",
    quote:
      "Must elitat est vehicula vulputate convallis ut, ac mont bibendum al elementum sapien dui egested faucibus.",
    name: "Kristin Watson",
    role: "Manager, Sagon Inc.",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2.5&w=96&h=96&q=80",
  },
  {
    title: "Awesome, thank you!",
    quote:
      "Rhoncus sed tristique ac dolur. Mus etiam ut vestibulum ut viverra ut. Eit etiam dolor placerat vierra ac egestas at ducibus. Nulla et tempor montes.",
    name: "Zain Gomers",
    role: "Director, Zain Group",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc224a43e?auto=format&fit=facearea&facepad=2.5&w=96&h=96&q=80",
  },
];

/* ---------------------------------- */
/* Blog                               */
/* ---------------------------------- */

export type Post = {
  badge: string;
  date: string;
  title: string;
  image: string;
};

export const posts: Post[] = [
  {
    badge: "News",
    date: "30 March 2024",
    title:
      "Revitalizing Workplace Morale: Innovative Tactics For Boosting Employee Engagement In 2024",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    badge: "Blog",
    date: "30 March 2024",
    title: "How To Avoid The Top Six Most Common Job Interview Mistakes",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
  },
];

export const blogIntro =
  "Morbi faucibus sed turpis lectus feugiat tincidunt. Rhoncus sed tristique in dolor.";

/* ---------------------------------- */
/* Footer                             */
/* ---------------------------------- */

export const footerAbout =
  "Quis enim pellentesque viverra nulla sem venenatis. Ullamcorper arcu nibh vivamus aliquet nunc mauris duis.";

export const footerNewsletter =
  "Eu nunc pretium augue pulvinar. Sem nunc at aliquet urna in senectus.";

export const footerCompany = [
  "About Us",
  "Our Team",
  "Careers",
  "For Candidates",
  "For Employers",
];

export const footerCategories = [
  "Telecommunications",
  "Hotels & Tourism",
  "Construction",
  "Education",
  "Financial Services",
];
