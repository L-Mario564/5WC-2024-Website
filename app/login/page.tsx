'use client';
import { buildApiUrl, env } from '@/utils';
import { useAsyncEffect, useError } from '@/utils/hooks';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const [promptDiscord, setPromptDiscordState] = useState(false);
  const [shouldFetch, setShouldFetchedState] = useState(false);
  const { setError } = useError();

  // We do an additional side-effect due to the dev server running the mounting side-effect twice instead of once
  useEffect(() => {
    setShouldFetchedState(true);
  }, []);

  useAsyncEffect(async () => {
    if (!shouldFetch) return;
    let resp: Response | undefined;

    try {
      resp = await fetch(buildApiUrl('/auth/session/login'), {
        credentials: 'include',
        cache: 'no-cache'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const message = 'Failed to log in';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    setPromptDiscordState(true);
  }, [shouldFetch]);

  return (
    <>
      {promptDiscord ? (
        <div className='backdrop'>
          <div className='modal'>
            <h2>Successfully Logged In</h2>
            <p>
              Your authentication was successful. Make sure you&apos;re part of the 5WC Discord
              server. Being part of the server is a <b>REQUIREMENT</b> to be eligible to play.
            </p>
            <div className='btn-container'>
              <a
                href={env.NEXT_PUBLIC_DISCORD_SERVER_INVITE}
                className='btn btn-primary'
                target='_blank'
              >
                Join Discord
              </a>
              <a href={env.NEXT_PUBLIC_ORIGIN} className='btn'>
                Already Joined
              </a>
            </div>
          </div>
        </div>
      ) : undefined}
      <div className='simple-message-container'>
        <span>Logging into 5WC, please wait a moment...</span>
      </div>
    </>
  );
}
