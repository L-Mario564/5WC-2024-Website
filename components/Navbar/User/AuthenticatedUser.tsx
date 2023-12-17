'use client';
import NavbarLines from '@/components/Navbar/Lines/NavbarLines';
import Link from 'next/link';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { AuthUser } from '@/utils/types';
import { useOnClickOutside } from '@/utils/hooks';
import { buildApiUrl } from '@/utils';
// @ts-ignore The current file is a CommonJS module whose imports will produce 'require' calls;
import { env } from '@/env.mjs';
import styles from './AuthenticatedUser.module.scss';

type Props = {
  user: AuthUser;
};

export default function AuthenticatedUser({ user }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userContainerRef = useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenuState] = useState(false);
  const links: {
    href: string;
    label: string;
  }[] = [{
    href: '/',
    label: 'Change Discord Account'
  }, {
    href: '/',
    label: 'My Registration'
  }];

  useOnClickOutside({
    ref: menuRef,
    ignoreRef: userContainerRef,
    onClick: closeMenu
  });

  function toggleMenu() {
    setShowMenuState((showMenu) => !showMenu);
  }

  function closeMenu() {
    setShowMenuState(false);
  }

  async function logout() {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/logout');

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch(err) {
      console.error(err);
    }
    
    
    if (!resp?.ok) {
      const data = await resp?.text();
      console.info('Response: ' + data);
      // TODO: Display error to user
      return;
    }

    setShowMenuState(false);
    location.href = env.NEXT_PUBLIC_ORIGIN;
  }

  return (
    <>
      {showMenu ? (
        <div ref={menuRef} className={styles.menu}>
          <ul>
            {links.map(({ href, label }) => (
              <li key={label}>
                <Link href={href} onClick={closeMenu}>{label}</Link>
              </li>
            ))}
          </ul>
          <div className={styles.divider} />
          <button className='btn btn-primary' onClick={logout}>
            Logout
          </button>
        </div>
      ) : undefined}
      <div className={styles.container}>
        <NavbarLines />
        <button ref={userContainerRef} className={styles.userBtn} onClick={toggleMenu}>
          <Image
            src="/user-bg-deco.png"
            alt="user bg deco"
            width={272}
            height={90}
            className={styles.bgDeco}
          />
          <div className={styles.container}>
            <Image
              src={user.osu.avatar_url}
              alt="authenticated user profile pic"
              width={58}
              height={58}
              quality={80}
              className={styles.pfp}
            />
            <div className={styles.rightContainer}>
              <span className={styles.username}>{user.osu.username}</span>
              <div className={styles.lines}>
                <div className={styles.grayLine} />
                <div className={styles.grayLine} />
                <div className={styles.whiteLine} />
                <div className={styles.whiteLine} />
              </div>
            </div>
          </div>
        </button>
      </div>
    </>
  );
}
