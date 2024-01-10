'use client';

import clsx from 'clsx';
import LoginButton from '@/components/Navbar/LoginButton/LoginButton';
import AuthenticatedUser from '@/components/Navbar/User/AuthenticatedUser';
import NavbarLogo from '@/components/Navbar/Logo/NavbarLogo';
import ResponsiveNavBar from '@/components/Navbar/Responsive/ResponsiveNavbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/utils/hooks';
import styles from './Navbar.module.scss';

export default function Navbar() {  
  const user = useUser();

  const pathname = usePathname();
  const links: {
    href: string;
    label: string;
  }[] = [{
    href: '/rules',
    label: 'Info'
  }, {
    href: '/',
    label: 'Teams'
  }, {
    href: '/',
    label: 'Schedule'
  }, {
    href: '/',
    label: 'Mappools'
  }, {
    href: '/',
    label: 'Staff'
  }];

  return (
    <nav className={styles.navbar}>
      <NavbarLogo />
      <ul className={styles.routes}>
        {links.map(({ href, label }) => (
          <li key={label} className={clsx((pathname === href) ? styles.active : null)}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul>
      <ResponsiveNavBar links={links} pathname={pathname} />
      {user ? <AuthenticatedUser user={user} /> : <LoginButton />}
    </nav>
  );
}
