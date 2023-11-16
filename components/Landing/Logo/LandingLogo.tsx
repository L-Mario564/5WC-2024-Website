'use client';
import logo from '@/public/landing-header.svg';
import Image from 'next/image';

export default function LandingLogo() {
  return (
    <div>
      <Image src={logo} alt="5WC Logo"></Image>
    </div>
  );
}
