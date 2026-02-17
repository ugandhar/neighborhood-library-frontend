import './globals.css';

export const metadata = {
  title: 'Neighborhood Library',
  description: 'Minimal frontend for library operations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
