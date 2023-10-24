'use client';

/* import Image from 'next/image'; */
import clsx from 'clsx';
import LoginButton from 'components/LoginButton/LoginButton';
import NavbarLogo from 'components/NavbarLogo/NavbarLogo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';

export default function Navbar() {
  let pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <NavbarLogo></NavbarLogo>
      <ul className={styles.routes}>
        {/* <li className={clsx(pathname === '/' ? styles.active : null)}>
          <Link href={'/'}>Home</Link>
          <span />
        </li> */}
        <li className={clsx(pathname === '/rules' ? styles.active : null)}>
          <Link href={'/rules'}>Info</Link>
          {/* <span /> */}
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Teams</Link>
          {/* <span /> */}
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Schedule</Link>
          {/* <span /> */}
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Mappool</Link>
          {/* <span /> */}
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Staff</Link>
          {/* <span /> */}
        </li>
      </ul>
      <LoginButton />
    </nav>
  );
}
