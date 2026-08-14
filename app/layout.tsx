import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'High Protein Cookbook',
  description: 'A searchable high-protein recipe library with pantry filters, favorites, serving adjustments, and cooking guides.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
