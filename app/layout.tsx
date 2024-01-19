'use client';
import Toast from '@/components/Toast/Toast';
import UserProvider from '@/contexts/UserContext';
import ErrorProvider from '@/contexts/ErrorContext';
import Navbar from 'components/Navbar/Navbar';
import { Barlow } from 'next/font/google';
import { useError } from '@/utils/hooks';
import 'styles/globals.scss';

const barlowFont = Barlow({
  variable: '--barlow-font',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin']
});

function ToastError() {
  const { error } = useError();

  return error ? (
    <Toast error={error} />
  ) : <></>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>5WC | 5 Digit World Cup 2024</title>
        <link rel="icon" href="/logo.png" />
      </head>
      <ErrorProvider>
        <UserProvider>
          <body className={barlowFont.variable}>
            <Navbar />
            <ToastError />
            <img className='bg-img' alt='bg' src='/bg.png' />
            <main>{children}</main>
          </body>
        </UserProvider>
      </ErrorProvider>
    </html>
  );
}
