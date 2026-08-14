import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://high-protein-cookbook.jeffdaniels241.chatgpt.site'),
  title: 'High-Protein Rice Cooker Cookbook',
  description: 'A candid, searchable library of 127 high-protein recipes for rice cookers, ovens, and skillets.',
  openGraph: { title: 'High-Protein Rice Cooker Cookbook', description: 'Simple, protein-rich recipes with honest testing notes and rice-cooker guidance.', type: 'website', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'High-Protein Rice Cooker Cookbook', description: 'Simple, protein-rich recipes with honest testing notes.', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
