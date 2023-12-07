'use client';
import NavbarLines from 'components/NavbarLines/NavbarLines';
import styles from './LoginButton.module.scss';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginButton() {
  const [promtLogin, setPromptLoginState] = useState(false);

  function onLoginBtnClick() {
    setPromptLoginState(true);
  }

  function onPromptCancel() {
    setPromptLoginState(false);
  }

  return (
    <>
      {promtLogin ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Login</h2>
            <p>To login to 5WC, you must authenticate with your osu! and Discord account.</p>
            <div className={styles.modalBtnContainer}>
              <Link href='/api/auth/osu' className='btn btn-primary'>
                Login
              </Link>
              <button className='btn' onClick={onPromptCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      <div className={styles.container}>
        <NavbarLines />
        <button className={styles.loginButton} onClick={onLoginBtnClick}>LOGIN</button>
      </div>
    </>
  );
}
