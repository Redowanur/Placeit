import type {
  Alumni,
  Attempt,
  Cohort,
  Company,
  DB,
  Invitation,
  PlacementStatus,
  Student,
  Test,
  University,
} from "./types";

// Only SUST's email domain comes from your backend; the rest are placeholders.
export const universities: University[] = [
  { id: "u-sust", name: "Shahjalal University of Science and Technology", short: "SUST", city: "Sylhet", emailDomain: "student.sust.edu" },
  { id: "u-buet", name: "Bangladesh University of Engineering and Technology", short: "BUET", city: "Dhaka", emailDomain: "student.buet.ac.bd" },
  { id: "u-du", name: "University of Dhaka", short: "DU", city: "Dhaka", emailDomain: "student.du.ac.bd" },
  { id: "u-cuet", name: "Chittagong University of Engineering and Technology", short: "CUET", city: "Chattogram", emailDomain: "student.cuet.ac.bd" },
  { id: "u-ruet", name: "Rajshahi University of Engineering and Technology", short: "RUET", city: "Rajshahi", emailDomain: "student.ruet.ac.bd" },
];

// Fictional companies on purpose.
export const companies: Company[] = [
  { id: "c-nodi", name: "Nodi Tech", industry: "Product engineering", hue: 188 },
  { id: "c-shapla", name: "Shapla Systems", industry: "Enterprise software", hue: 335 },
  { id: "c-surma", name: "Surma Cloud", industry: "Cloud and DevOps", hue: 212 },
  { id: "c-padma", name: "Padma Payments", industry: "Fintech", hue: 28 },
  { id: "c-meghna", name: "Meghna Labs", industry: "Applied AI", hue: 265 },
  { id: "c-pixel", name: "Pixel Haat", industry: "Design and product", hue: 148 },
  { id: "c-tara", name: "Tara Robotics", industry: "Embedded systems", hue: 8 },
  { id: "c-jamuna", name: "Jamuna Telecom", industry: "Telecom", hue: 98 },
];

export const cohorts: Cohort[] = [
  { id: "co-sust-cse", universityId: "u-sust", department: "CSE" },
  { id: "co-sust-eee", universityId: "u-sust", department: "EEE" },
  { id: "co-sust-swe", universityId: "u-sust", department: "SWE" },
  { id: "co-buet-cse", universityId: "u-buet", department: "CSE" },
  { id: "co-du-cse", universityId: "u-du", department: "CSE" },
  { id: "co-cuet-eee", universityId: "u-cuet", department: "EEE" },
  { id: "co-ruet-cse", universityId: "u-ruet", department: "CSE" },
];

const alumniRows: Array<[string, string, string, string, string, string, number]> = [
  // id, name, title, companyId, universityId, phone, gradYear
  ["a-rafiq", "Rafiq Ahmed", "Senior Software Engineer", "c-nodi", "u-sust", "+880 1700-000101", 2017],
  ["a-tasnim", "Tasnim Chowdhury", "Engineering Manager", "c-nodi", "u-sust", "+880 1700-000102", 2014],
  ["a-imran", "Imran Hossain", "Backend Engineer", "c-shapla", "u-buet", "+880 1700-000103", 2018],
  ["a-farzana", "Farzana Karim", "Staff Engineer", "c-surma", "u-sust", "+880 1700-000104", 2015],
  ["a-mahbub", "Mahbub Alam", "DevOps Lead", "c-surma", "u-cuet", "+880 1700-000105", 2016],
  ["a-sadia", "Sadia Rahman", "Data Scientist", "c-meghna", "u-du", "+880 1700-000106", 2019],
  ["a-arif", "Arif Mahmud", "Product Designer", "c-pixel", "u-sust", "+880 1700-000107", 2020],
  ["a-nabila", "Nabila Islam", "Software Engineer", "c-padma", "u-ruet", "+880 1700-000108", 2018],
  ["a-shakil", "Shakil Ahmed", "Tech Lead", "c-padma", "u-sust", "+880 1700-000109", 2013],
  ["a-mitu", "Mitu Barua", "Firmware Engineer", "c-tara", "u-cuet", "+880 1700-000110", 2017],
  ["a-zahid", "Zahid Hasan", "Network Engineer", "c-jamuna", "u-ruet", "+880 1700-000111", 2016],
  ["a-ritu", "Ritu Das", "QA Lead", "c-shapla", "u-sust", "+880 1700-000112", 2018],
];

const alumni: Alumni[] = alumniRows.map(([id, name, title, companyId, universityId, phone, gradYear]) => {
  const first = name.split(" ")[0].toLowerCase();
  const company = companies.find((c) => c.id === companyId)!;
  return {
    id,
    role: "alumni",
    name,
    email: `${first}@${company.name.toLowerCase().replace(/[^a-z]/g, "")}.com`,
    phone,
    verified: true,
    companyId,
    title,
    universityId,
    gradYear,
  };
});

const firstNames = [
  "Nusrat", "Tanvir", "Mehedi", "Samira", "Rakib", "Tahmina", "Shuvo", "Anika", "Fahim", "Lamia",
  "Sabbir", "Maliha", "Nayeem", "Jerin", "Habib", "Puja", "Rony", "Sumaiya", "Asif", "Tisha",
  "Kamrul", "Mou", "Parvez", "Nafisa", "Zubair", "Ishrat", "Sohan", "Orin", "Dihan", "Faria",
];
const lastNames = [
  "Jahan", "Hasan", "Rahman", "Akter", "Islam", "Khan", "Sarker", "Begum", "Mia", "Roy",
  "Uddin", "Chowdhury", "Talukder", "Sultana", "Biswas", "Paul", "Majumder", "Ali", "Das", "Karim",
];

const statusPattern: PlacementStatus[] = [
  "not_applied", "applied", "applied", "written_test", "not_applied", "interview",
  "applied", "placed", "not_applied", "not_placed", "applied", "written_test",
];

const cohortSizes: Record<string, number> = {
  "co-sust-cse": 12,
  "co-sust-eee": 8,
  "co-sust-swe": 9,
  "co-buet-cse": 14,
  "co-du-cse": 10,
  "co-cuet-eee": 7,
  "co-ruet-cse": 8,
};

function buildStudents(): Student[] {
  const list: Student[] = [];
  let n = 0;
  for (const cohort of cohorts) {
    const uni = universities.find((u) => u.id === cohort.universityId)!;
    const size = cohortSizes[cohort.id];
    for (let i = 0; i < size; i++) {
      const first = firstNames[(n * 7 + i * 3) % firstNames.length];
      const last = lastNames[(n * 5 + i * 11) % lastNames.length];
      const isDemo = cohort.id === "co-sust-cse" && i === 0;
      const name = isDemo ? "Nusrat Jahan" : `${first} ${last}`;
      list.push({
        id: isDemo ? "s-demo" : `s-${cohort.id.slice(3)}-${i + 1}`,
        role: "student",
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}${isDemo ? "" : i + 1}@${uni.emailDomain}`,
        phone: `+880 1800-${String(100000 + n * 37 + i)}`,
        verified: true,
        regNo: 2020331000 + n * 3 + i,
        cohortId: cohort.id,
        status: isDemo ? "applied" : statusPattern[(i + n) % statusPattern.length],
        resumeUrl: i % 3 === 0 && !isDemo ? `https://example.com/resume/${first.toLowerCase()}` : undefined,
      });
    }
    n += 1;
  }
  return list;
}

const students = buildStudents();
const demoStudent = students.find((s) => s.id === "s-demo")!;
const sustClassmates = students.filter((s) => s.cohortId === "co-sust-cse");

const invitations: Invitation[] = [
  { id: "i-1", cohortId: "co-sust-cse", alumniId: "a-rafiq", companyId: "c-nodi", invitedBy: sustClassmates[2].id, status: "accepted", createdAt: "2026-09-20T09:00:00Z", respondedAt: "2026-09-21T11:00:00Z" },
  { id: "i-2", cohortId: "co-sust-cse", alumniId: "a-farzana", companyId: "c-surma", invitedBy: demoStudent.id, status: "pending", createdAt: "2026-10-09T08:30:00Z" },
  { id: "i-3", cohortId: "co-sust-cse", alumniId: "a-imran", companyId: "c-shapla", invitedBy: sustClassmates[4].id, status: "rejected", createdAt: "2026-09-25T10:00:00Z", respondedAt: "2026-09-27T16:00:00Z" },
  { id: "i-4", cohortId: "co-sust-eee", alumniId: "a-rafiq", companyId: "c-nodi", invitedBy: students.find((s) => s.cohortId === "co-sust-eee")!.id, status: "pending", createdAt: "2026-10-11T12:00:00Z" },
  { id: "i-5", cohortId: "co-sust-swe", alumniId: "a-tasnim", companyId: "c-nodi", invitedBy: students.find((s) => s.cohortId === "co-sust-swe")!.id, status: "pending", createdAt: "2026-10-10T12:00:00Z" },
  { id: "i-6", cohortId: "co-buet-cse", alumniId: "a-sadia", companyId: "c-meghna", invitedBy: students.find((s) => s.cohortId === "co-buet-cse")!.id, status: "accepted", createdAt: "2026-09-18T12:00:00Z", respondedAt: "2026-09-19T12:00:00Z" },
  { id: "i-7", cohortId: "co-du-cse", alumniId: "a-shakil", companyId: "c-padma", invitedBy: students.find((s) => s.cohortId === "co-du-cse")!.id, status: "pending", createdAt: "2026-10-12T12:00:00Z" },
];

const tests: Test[] = [
  {
    id: "t-1",
    cohortId: "co-sust-cse",
    alumniId: "a-rafiq",
    companyId: "c-nodi",
    title: "Nodi Tech screening: fundamentals",
    durationMin: 15,
    passMark: 60,
    createdAt: "2026-09-28T08:00:00Z",
    questions: [
      { id: "q1", text: "What is the time complexity of binary search on a sorted array of n items?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correct: 1 },
      { id: "q2", text: "Which HTTP status code means a resource was created?", options: ["200", "204", "201", "301"], correct: 2 },
      { id: "q3", text: "In SQL, which clause filters rows after GROUP BY has been applied?", options: ["WHERE", "ORDER BY", "LIMIT", "HAVING"], correct: 3 },
      { id: "q4", text: "What does git rebase do?", options: ["Replays commits onto a different base", "Deletes the remote branch", "Creates a tag", "Reverts the last commit"], correct: 0 },
      { id: "q5", text: "Which data structure removes items in first-in, first-out order?", options: ["Stack", "Heap", "Queue", "Tree"], correct: 2 },
    ],
  },
];

const attempts: Attempt[] = [
  { id: "at-1", testId: "t-1", studentId: sustClassmates[1].id, answers: [1, 2, 3, 0, 2], score: 5, total: 5, submittedAt: "2026-09-29T10:00:00Z", shortlisted: true },
  { id: "at-2", testId: "t-1", studentId: sustClassmates[2].id, answers: [1, 2, 3, 1, 2], score: 4, total: 5, submittedAt: "2026-09-29T10:20:00Z", shortlisted: true },
  { id: "at-3", testId: "t-1", studentId: sustClassmates[3].id, answers: [0, 2, 0, 1, 2], score: 2, total: 5, submittedAt: "2026-09-29T11:00:00Z", shortlisted: false },
  { id: "at-4", testId: "t-1", studentId: sustClassmates[5].id, answers: [1, 0, 3, 0, 1], score: 3, total: 5, submittedAt: "2026-09-30T09:00:00Z", shortlisted: false },
];

export function createSeed(): DB {
  return structuredClone({
    universities,
    companies,
    cohorts,
    users: [...students, ...alumni],
    invitations,
    tests,
    attempts,
  });
}

export const DEMO_STUDENT_ID = "s-demo";
export const DEMO_ALUMNI_ID = "a-rafiq";
