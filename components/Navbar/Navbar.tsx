'use client';

/* import Image from 'next/image'; */
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.scss';

export default function Navbar() {
  let pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        {/* <Image src={""} alt={"5WC logo"} /> */}
        5wc
      </div>
      <ul className={styles.routes}>
        <li className={clsx(pathname === '/' ? styles.active : null)}>
          <Link href={'/'}>Home</Link>
          <span />
        </li>
        <li className={clsx(pathname === '/rules' ? styles.active : null)}>
          <Link href={'/rules'}>Info</Link>
          <span />
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Teams</Link>
          <span />
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Schedule</Link>
          <span />
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Mappool</Link>
          <span />
        </li>
        <li /* className={clsx((pathname === '/') ? styles.active : null)} */>
          <Link href={'/'}>Staff</Link>
          <span />
        </li>
      </ul>
      <button className={styles.loginButton}>Login</button>
    </nav>
  );
}
