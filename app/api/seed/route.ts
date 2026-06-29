import { NextResponse } from "next/server";
import { createScholarship } from "@/lib/db";
import { generateId } from "@/lib/utils";

const sampleScholarships = [
  {
    id: generateId(),
    title: "Rhodes Scholarship 2026",
    description: "The Rhodes Scholarship is the oldest and perhaps the most prestigious international scholarship program in the world. It enables outstanding young people from around the world to study at the University of Oxford.",
    amount: "$70,000",
    deadline: "2026-10-01",
    eligibility: "Open to students aged 18-24 with exceptional academic achievement, leadership, and commitment to service.",
    category: "STEM",
    country: "UK",
    image_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Fulbright Foreign Student Program",
    description: "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States.",
    amount: "$50,000",
    deadline: "2026-09-15",
    eligibility: "International students with a bachelor's degree, strong academic record, and leadership potential.",
    category: "Social Sciences",
    country: "USA",
    image_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Chevening Scholarships",
    description: "Chevening is the UK government's international awards programme aimed at developing global leaders. Funded by the Foreign, Commonwealth & Development Office.",
    amount: "$45,000",
    deadline: "2026-11-05",
    eligibility: "Citizens of Chevening-eligible countries with at least two years of work experience and a bachelor's degree.",
    category: "Business",
    country: "UK",
    image_url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Erasmus Mundus Joint Masters",
    description: "Erasmus Mundus Joint Masters are prestigious international study programmes funded by the European Union. Students study in at least two different countries.",
    amount: "$35,000",
    deadline: "2026-12-20",
    eligibility: "Students worldwide with a relevant bachelor's degree. Previous Erasmus scholarship holders are not eligible.",
    category: "Engineering",
    country: "Germany",
    image_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Vanier Canada Graduate Scholarships",
    description: "The Vanier Canada Graduate Scholarships program aims to attract and retain world-class doctoral students by supporting those who demonstrate leadership skills and a high standard of scholarly achievement.",
    amount: "$50,000",
    deadline: "2026-08-31",
    eligibility: "International and Canadian students pursuing doctoral studies at Canadian universities with a first-class average.",
    category: "STEM",
    country: "Canada",
    image_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    created_at: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Australia Awards Scholarships",
    description: "Australia Awards Scholarships are long-term awards administered by the Department of Foreign Affairs and Trade. They provide opportunities for people from developing countries.",
    amount: "$60,000",
    deadline: "2026-04-30",
    eligibility: "Citizens of participating countries in Asia, Pacific, Africa, and the Middle East with minimum work experience requirements.",
    category: "Medicine",
    country: "Australia",
    image_url: "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?w=800",
    created_at: new Date().toISOString(),
  },
];

export async function POST() {
  for (const scholarship of sampleScholarships) {
    await createScholarship(scholarship);
  }
  return NextResponse.json({ message: "Database seeded with 6 scholarships", count: sampleScholarships.length });
}
