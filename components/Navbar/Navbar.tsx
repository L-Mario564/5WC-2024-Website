'use client';

/* import Image from 'next/image'; */
import clsx from 'clsx';
import LoginButton from '@/components/Navbar/LoginButton/LoginButton';
import NavbarLogo from '@/components/Navbar/Logo/NavbarLogo';
import ResponsiveNavBar from './Responsive/ResponsiveNavbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const pathname = usePathname();
  const links: {
    href: string;
    label: string;
  }[] = [{
    href: '/rules',
    label: 'Info'
  }, {
    href: '/teams',
    label: 'Teams'
  }, {
    href: '/schedule',
    label: 'Schedule'
  }, {
    href: '/mappools',
    label: 'Mappools'
  }, {
    href: '/staff',
    label: 'Staff'
  }];

  return (
    <nav className={styles.navbar}>
      <NavbarLogo></NavbarLogo>
      <ul className={styles.routes}>
        {links.map(({ href, label }) => (
          <li key={label} className={clsx((pathname === href) ? styles.active : null)}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
      <ResponsiveNavBar links={links} pathname={pathname} />
      <LoginButton />
    </nav>
  );
}
