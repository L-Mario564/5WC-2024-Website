'use client';

import Player from '@/components/Player/Player';
import clsx from 'clsx';
import { useAsyncEffect, useUser } from '@/utils/hooks';
import { useState } from 'react';
import { teamSchema } from '@/utils/schemas';
import { buildApiUrl } from '@/utils';
import type { Team } from '@/utils/types';
import styles from './organize-team.module.scss';

type SelectedUser = {
  playerId: number;
  as: 'roster' | 'backup' | 'candidate'
};

export default function OrganizeTeamPage() {
  const user = useUser();
  const [team, setTeam] = useState<Team | undefined>();
  const [refresh, setRefreshState] = useState(true);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | undefined>();

  useAsyncEffect(async () => {
    if (!user || !refresh) return;

    let resp: Response | undefined;
    let url = buildApiUrl(`/teams/${user.osu.country.code}/members`);

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

    let data = await resp.text();
    const parsedTeam = teamSchema.safeParse(JSON.parse(data));

    if (!parsedTeam.success) {
      // TODO: Display error to user / improve error handling
      console.info('Response: ' + data);
      throw Error(`Server (at "${url}") sent a response different than the one expected`);
    }

    setTeam(parsedTeam.data);
    setRefreshState(false);
  }, [user, refresh]);

  function onUserBtnClick(playerId: number, as: SelectedUser['as']) {
    setSelectedUser(selectedUser?.playerId === playerId ? undefined : { playerId, as });
  }

  async function moveToRoster() {
    let resp: Response | undefined;
    const url = buildApiUrl(`/teams/${user?.osu.country.code}/members`);
    const body = {
      players: []
    };

    try {
      resp = await fetch(url, {
        method: 'PATCH',
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
  }

  return (
    !user ? (
      <div className='simple-message-container'>
        <span>Getting user information...</span>
      </div>
    ) : !user.is_organizer ? (
      <div className='simple-message-container'>
        <span>You do not have the necessary permissions to organize a team</span>
      </div>
    ) : !team ? (
      <div className='simple-message-container'>
        <span>Getting team information...</span>
      </div>
    ) : (
      <>
        <div className={styles.pageContainer}>
          <div className={styles.teamContainer}>
            <div className={styles.roster}>
              <div className={styles.header}>Roster</div>
              <div className={styles.scroll}>
                <div className={styles.playersContainer}>
                  {team.roster.map((player) => (
                    <Player
                      key={`roster-${player.user_id}`}
                      player={player}
                      isSelected={player.user_id === selectedUser?.playerId}
                      onClick={() => onUserBtnClick(player.user_id, 'roster')}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.backup}>
              <div className={styles.header}>Backup Players</div>
            </div>
          </div>
          <div className={styles.candidates}>
            <div className={styles.header}>Candidates</div>
            <div className={styles.scroll}>
                <div className={styles.playersContainer}>
                  {team.candidates.map((player) => (
                    <Player
                      key={`candidates-${player.user_id}`}
                      player={player}
                      isSelected={player.user_id === selectedUser?.playerId}
                      onClick={() => onUserBtnClick(player.user_id, 'candidate')}
                    />
                  ))}
                </div>
              </div>
          </div>
        </div>
        {selectedUser && (
          <div className={styles.modalContainer}>
            <div className={clsx('modal', styles.modal)}>
              {selectedUser.as === 'candidate' ? (
                <>
                  <button className='btn btn-primary'>Move To Roster</button>
                  <button className='btn'>Make Backup Player</button>
                </>
              ) : selectedUser.as === 'backup' ? (
                <>
                </>
              ) : (
                <>
                </>
              )}
            </div>
          </div>
        )}
      </>
    )
  );
}
