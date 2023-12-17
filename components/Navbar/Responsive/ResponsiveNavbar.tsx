import clsx from 'clsx';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useRef, useState } from 'react';
import { useOnClickOutside } from '@/utils/hooks';
import styles from './ResponsiveNavbar.module.scss';

interface Props {
  links: {
    href: string;
    label: string;
  }[];
  pathname: string;
}

export default function ResponsiveNavBar({ links, pathname }: Props) {
  const responsiveLinksRef = useRef<HTMLUListElement | null>(null);
  const toggleMenuBtn = useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenuState] = useState(false);

  useOnClickOutside({
    ref: responsiveLinksRef,
    ignoreRef: toggleMenuBtn,
    onClick: closeMenu
  });
  
  function toggleMenu() {
    setShowMenuState((showMenu) => !showMenu);
  }

  function closeMenu() {
    setShowMenuState(false);
  }

  return (
    <>
      <div className={styles.btnContainer}>
        <button ref={toggleMenuBtn} className={styles.btn} onClick={toggleMenu}>
          <Menu size={42} className={styles.btnIcon} />
        </button>
      </div>
      {showMenu ? <ul ref={responsiveLinksRef} className={styles.menu}>
        {links.map(({ href, label }) => (
          <li key={label} className={clsx((pathname === href) ? styles.active : null)}>
            <Link href={href} onClick={closeMenu}>{label}</Link>
          </li>
        ))}
      </ul> : undefined}
    </>
  );
}