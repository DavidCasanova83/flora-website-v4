// src/types/Location.ts
// TypeScript interfaces for location-based SEO pages

export interface Location {
  id: string;
  enabled: boolean;
  slug: string;
  cityName: string;
  departmentCode: string;
  region: string;
  geo: GeoCoordinates;
  seo: SEOData;
  hero: HeroSection;
  about: AboutSection;
  expertise: ExpertiseSection;
  realisations: RealisationsSection;
  prestations: PrestationsSection;
  zonesIntervention: ZonesSection;
  faq: FAQSection;
  contactFinal: ContactSection;
}

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface SEOData {
  title: string;
  metaDescription: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
}

export interface HeroSection {
  badge: string;
  h1: string;
  h2: string;
  paragraphs: string[];
  cta1: CTA;
  cta2: CTA;
  image: string;
  imageAlt: string;
}

export interface CTA {
  text: string;
  url: string;
  style: 'accent' | 'outline' | 'white';
}

export interface AboutSection {
  title: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
  cta: CTA;
}

export interface ExpertiseSection {
  title: string;
  subsections: ExpertiseSubsection[];
  image: string;
  imageAlt: string;
}

export interface ExpertiseSubsection {
  h3: string;
  content?: string;
  points?: string[];
}

export interface RealisationsSection {
  title: string;
  projects: ProjectCard[];
  ctaText: string;
  ctaUrl: string;
}

export interface ProjectCard {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
  projectSlug: string | null;
}

export interface PrestationsSection {
  title: string;
  services: ServiceCard[];
  ctaText: string;
  ctaUrl: string;
}

export interface ServiceCard {
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  points: string[];
}

export interface ZonesSection {
  title: string;
  intro: string;
  quartiers: string[];
  praticalInfo: {
    tempsTrajet: string;
    rdv: string;
    devis: string;
  };
}

export interface FAQSection {
  title: string;
  questions: FAQItem[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ContactSection {
  title: string;
  subtitle: string;
  accroche: string;
  businessInfo: {
    label: string;
    address: string;
    phone: string;
    email: string;
  };
  cta: CTA;
  message: string;
}
