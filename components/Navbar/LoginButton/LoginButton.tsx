'use client';
import NavbarLines from '@/components/Navbar/Lines/NavbarLines';
import styles from './LoginButton.module.scss';

export default function LoginButton() {
  return (
    <div className={styles.container}>
      <NavbarLines />
      <button className={styles.loginButton}>osu! LOGIN</button>
    </div>
  );
}
