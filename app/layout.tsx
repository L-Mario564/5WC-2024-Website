import UserProvider from '@/contexts/UserContext';
import Navbar from 'components/Navbar/Navbar';
import { Barlow } from 'next/font/google';
import 'styles/globals.scss';

export const metadata = {
  title: {
    template: '%s | 5WC',
    default: '5WC | 5 Digit World Cup'
  },
  description: 'Website of 5 Digit World Cup'
};

const barlowFont = Barlow({
  variable: '--barlow-font',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={barlowFont.variable}>
          <Navbar />
          <main>{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}
