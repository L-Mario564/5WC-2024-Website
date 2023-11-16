import clsx from 'clsx';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import styles from './ResponsiveNavbar.module.scss';

interface Props {
  links: {
    href: string;
    label: string;
  }[];
  pathname: string;
}

export default function ResponsiveNavBar({ links, pathname }: Props) {
  const [showMenu, setShowMenuState] = useState(false);
  
  function toggleMenu() {
    setShowMenuState((showMenu) => !showMenu);
  }

  return (
    <>
      <div className={styles.btnContainer}>
        <button className={styles.btn} onClick={toggleMenu}>
          <Menu size={42} className={styles.btnIcon} />
        </button>
      </div>
      {showMenu ? <ul className={styles.menu}>
        {links.map(({ href, label }) => (
          <li key={label} className={clsx((pathname === href) ? styles.active : null)}>
            <Link href={href}>{label}</Link>
          </li>
        ))}
      </ul> : undefined}
    </>
  );
}