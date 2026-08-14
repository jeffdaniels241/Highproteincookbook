import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://high-protein-cookbook.jeffdaniels241.chatgpt.site'),
  title: 'The Rice Cooker & Protein Kitchen',
  description: 'A candid, searchable library of 130 rice-cooker, bread, side, breakfast, and protein-forward recipes.',
  openGraph: { title: 'The Rice Cooker & Protein Kitchen', description: 'Practical recipes with honest testing notes and rice-cooker guidance.', type: 'website', images: ['/og.png'] },
  twitter: { card: 'summary_large_image', title: 'The Rice Cooker & Protein Kitchen', description: 'Practical recipes with honest testing notes.', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
