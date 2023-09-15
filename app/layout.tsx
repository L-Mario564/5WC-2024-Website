import Navbar from 'components/Navbar/Navbar';
import { Inter } from 'next/font/google';
import 'styles/globals.scss';

export const metadata = {
  title: {
    template: '%s | 5WC',
    default: '5WC | 5 Digit World Cup'
  },
  description: 'Website of 5 Digit World Cup'
};

const interFont = Inter({ variable: '--inter-font', subsets: ['latin'] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={interFont.variable}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
