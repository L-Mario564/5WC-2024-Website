'use client';
import Logo from '@/components/Logo/Logo';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './landing.module.scss';
import { env } from '@/utils';

export default function LandingPage() {
  const searchParams = useSearchParams();
  const promptDiscordParam = searchParams.get('prompt_discord') ?? 'false';
  const [promptDiscord, setPromptDiscordState] = useState(promptDiscordParam === 'true');

  function onCloseJoinDiscordPrompt() {
    setPromptDiscordState(false);
  }

  return (
    <>
      {promptDiscord ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Successfully Logged In</h2>
            <p>Your authentication was successful. Make sure you&apos;re part of the 5WC Discord server. Being part of the server is a <b>REQUIREMENT</b> to be eligible to play.</p>
            <div className='btn-container'>
              <a href={env.NEXT_PUBLIC_DISCORD_SERVER_INVITE} onClick={onCloseJoinDiscordPrompt} className='btn btn-primary'>
                Join Discord
              </a>
              <button className='btn' onClick={onCloseJoinDiscordPrompt}>
                Already Joined
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      <div className={styles.fullLogoContainer}>
        <div>
          <Logo className={styles.logo} />
        </div>
        <div className={styles.nameContainer}>
          <span className={styles.five}>5</span>
          <span className={styles.digit}>Digit</span>
          <span className={styles.worldCup}>World Cup</span>
        </div>
      </div>
    </>
  );
}
