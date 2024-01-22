'use client';
import Link from 'next/link';
import Image from 'next/image';
import Discord from '@/components/Discord/Discord';
import { useRef, useState } from 'react';
import { useError, useOnClickOutside } from '@/utils/hooks';
import { buildApiUrl, getCsrfToken, env } from '@/utils';
import type { AuthUser } from '@/utils/types';
import styles from './AuthenticatedUser.module.scss';

type Props = {
  user: AuthUser;
};

export default function AuthenticatedUser({ user }: Props) {
  const menuRef = useRef<HTMLDivElement | null>(null);
  const userContainerRef = useRef<HTMLButtonElement | null>(null);
  const [showMenu, setShowMenuState] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showChangeDiscordAccountModal, setShowChangeDiscordAccountModal] = useState(false);
  const { setError } = useError();

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

  function closeAllModals() {
    setShowDeleteAccountModal(false);
    setShowChangeDiscordAccountModal(false);
  }

  async function logout() {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/logout');

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const message = 'Failed to log out';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    setShowMenuState(false);
    location.reload();
  }

  function promptAccountDeletion() {
    closeMenu();
    setShowDeleteAccountModal(true);
  }

  function promptDiscordAccountChange() {
    closeMenu();
    setShowChangeDiscordAccountModal(true);
  }

  async function deleteAccount() {
    let resp: Response | undefined;
    const url = buildApiUrl('/auth/session/delete_account');
    const csrf = getCsrfToken();

    if (!csrf) {
      console.warn('CSRF token not found. Stopping execution');
      return;
    }

    try {
      resp = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
        cache: 'no-cache',
        headers: {
          'X-CSRFToken': csrf
        }
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const message = 'Failed to delete account';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);
      console.info('CSRF token: ' + csrf);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    closeAllModals();
    location.href = env.NEXT_PUBLIC_ORIGIN;
  }

  function changeDiscordAccount() {
    const loginUrl = `${env.NEXT_PUBLIC_ORIGIN}/login`;
    location.href = buildApiUrl(`/auth/discord/prompt_login/?return_page=${encodeURI(loginUrl)}`);
  }

  return (
    <>
      {showChangeDiscordAccountModal ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Change Discord Account</h2>
            <p>
              If you need to change the Discord account linked to your 5WC account (and therefore,
              registration), then you need to log in again.
            </p>
            <div className='btn-container'>
              <button className='btn btn-primary' onClick={changeDiscordAccount}>
                Log In
              </button>
              <button className='btn' onClick={closeAllModals}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      {showDeleteAccountModal ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Delete Account</h2>
            <p>
              Are you sure you want to delete your 5WC account? This also means that you&apos;re
              registration is removed from the tournament, regardless if you&apos;re part of a team
              or not.
            </p>
            <div className='btn-container'>
              <button className='btn btn-error' onClick={deleteAccount}>
                Delete
              </button>
              <button className='btn' onClick={closeAllModals}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      {showMenu ? (
        <div ref={menuRef} className={styles.menu}>
          <ul>
            {user.is_organizer ? (
              <li>
                <Link href='/manage-team'>Manage Team</Link>
              </li>
            ) : undefined}
            <li>
              <button onClick={promptDiscordAccountChange}>Change Discord Account</button>
            </li>
            <li>
              <button onClick={promptAccountDeletion}>Delete Account</button>
            </li>
          </ul>
          <div className={styles.divider} />
          <button className='btn btn-primary' onClick={logout}>
            Logout
          </button>
        </div>
      ) : undefined}
      <button ref={userContainerRef} className={styles.userBtn} onClick={toggleMenu}>
        <Image
          src={user.osu.avatar_url}
          alt='authenticated user profile pic'
          width={50}
          height={50}
          quality={80}
          className={styles.pfp}
        />
        <div className={styles.osuUsername}>{user.osu.username}</div>
        <div className={styles.discordUsername}>
          <Discord className={styles.discordIcon} /> {user.discord.username}
        </div>
      </button>
    </>
  );
}
