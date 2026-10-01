// Re-exports for convenience: import { Layout, Header } from '@pcl/design-system'
export { default as Layout } from './components/Layout.astro';
export { default as Header } from './components/Header.astro';
export { default as Footer } from './components/Footer.astro';
export { default as Seo } from './components/Seo.astro';
export { default as Button } from './components/Button.astro';
export { default as Card } from './components/Card.astro';
export { default as PageHeader } from './components/PageHeader.astro';
export { default as Section } from './components/Section.astro';
export { default as LangSwitch } from './components/LangSwitch.astro';
export { default as Watermark } from './components/Watermark.astro';
export { default as Figure } from './components/Figure.astro';
export { default as MediaCard } from './components/MediaCard.astro';
export { default as SectionMark } from './components/SectionMark.astro';
export type { Motif } from './components/Watermark.astro';
export type { SiteConfig, PageMeta } from './components/Layout.astro';
export type { NavItem } from './components/Header.astro';
export type { FooterLink } from './components/Footer.astro';

/** Per-site accents — the only colour that differs between the four sites. */
export const ACCENTS = {
  'lab-website': '#4B6A8A',
  'respct-guidelines': '#3F6F6B',
  'stamps': '#B5502F',
  'montreal-model': '#6E4560',
} as const;

/** ReSPCT section colours, text-safe variants (≥ 4.5:1 on paper #FBFAF8). */
export const RESPCT_SECTIONS = {
  physical: { label: 'Physical Environment', fill: '#5E9591', text: '#4E7B78' },
  dosing: { label: 'Dosing Session Procedure', fill: '#8A7B4F', text: '#807249' },
  framework: { label: 'Therapeutic Framework and Protocol', fill: '#6B7F9E', text: '#627491' },
  subjective: { label: 'Subjective Experiences', fill: '#8F6A62', text: '#8F6A62' },
} as const;
