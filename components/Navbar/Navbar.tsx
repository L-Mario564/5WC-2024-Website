'use client';

import clsx from 'clsx';
import AuthenticatedUser from '@/components/Navbar/User/AuthenticatedUser';
import ResponsiveNavBar from '@/components/Navbar/Responsive/ResponsiveNavbar';
import Logo from '@/components/Logo/Logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/utils/hooks';
import { useState } from 'react';
import { buildApiUrl, env } from '@/utils';
import styles from './Navbar.module.scss';

export default function Navbar() {
  const user = useUser();
  const pathname = usePathname();
  const [promtLogin, setPromptLoginState] = useState(false);

  const loginUrl = `${env.NEXT_PUBLIC_ORIGIN}/login`;
  const discordOAuthUrl = buildApiUrl(
    `/auth/discord/prompt_login/?return_page=${encodeURI(loginUrl)}`
  );
  const osuOAuthUrl = buildApiUrl(
    `/auth/osu/prompt_login/?return_page=${encodeURI(discordOAuthUrl)}`
  );

  const links: {
    href: string;
    label: string;
  }[] = [
    {
      href: '/rules',
      label: 'Rules'
    },
    {
      href: env.NEXT_PUBLIC_MAIN_SHEET_URL,
      label: 'Main Sheet'
    },
    {
      href: env.NEXT_PUBLIC_DISCORD_SERVER_INVITE,
      label: 'Discord'
    }
  ];

  function onLoginBtnClick() {
    setPromptLoginState(true);
  }

  function onCancelLogin() {
    setPromptLoginState(false);
  }

  return (
    <>
      {promtLogin ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Login</h2>
            <p>
              To login to 5WC (and therefore, register for the tournament), you must authenticate
              with your osu! and Discord account.
            </p>
            <div className='btn-container'>
              <a href={osuOAuthUrl} className='btn btn-primary'>
                Login
              </a>
              <button className='btn' onClick={onCancelLogin}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      <nav className={styles.navbar}>
        <Link href='/'>
          <Logo className={styles.logo} />
        </Link>
        <ul className={styles.routes}>
          {links.map(({ href, label }) => (
            <li key={label} className={clsx(pathname === href ? styles.active : null)}>
              {href.startsWith('/') ? <Link href={href}>{label}</Link> : <a href={href} target='_blank'>{label}</a>}
            </li>
          ))}
        </ul>
        <ResponsiveNavBar links={links} pathname={pathname} />
        {env.NEXT_PUBLIC_REGISTRATION_START_DATE.getTime() <= new Date().getTime() ? (
          user ? (
            <AuthenticatedUser user={user} />
          ) : user === null ? (
            <div className={styles.loginBtnContainer}>
              <button className='btn btn-primary' onClick={onLoginBtnClick}>
                Log In
              </button>
            </div>
          ) : (
            <div className={styles.loading}>
              Loading...
            </div>
          )
        ) : undefined}
      </nav>
    </>
  );
}
