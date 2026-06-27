import { MetadataRoute } from "next";

const BASE_URL = "https://interactive-physics-platform.vercel.app";

// معرّفات الدروس من ملفات الفيزياء
const LESSON_IDS = [
  // الصف التاسع - الفصل الأول
  "g9s1-u1-l1", "g9s1-u1-l2", "g9s1-u1-l3",
  "g9s1-u2-l1", "g9s1-u2-l2",
  "g9s1-u3-l1", "g9s1-u3-l2",
  // الصف التاسع - الفصل الثاني
  "g9s2-u4-l1", "g9s2-u4-l2",
  "g9s2-u5-l1", "g9s2-u5-l2", "g9s2-u5-l3",
  // الصف العاشر - الفصل الأول
  "g10s1-u1-l1", "g10s1-u1-l2",
  "g10s1-u2-l1", "g10s1-u2-l2", "g10s1-u2-l3",
  // الصف العاشر - الفصل الثاني
  "g10s2-u4-l1", "g10s2-u4-l2", "g10s2-u4-l3",
  "g10s2-u5-l1", "g10s2-u5-l2",
  "g10s2-u6-l1", "g10s2-u6-l2",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // الصفحة الرئيسية بأعلى أولوية
  const homeEntry: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];

  // صفحات الدروس
  const lessonEntries: MetadataRoute.Sitemap = LESSON_IDS.map((id) => ({
    url: `${BASE_URL}/?lesson=${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...homeEntry, ...lessonEntries];
}
