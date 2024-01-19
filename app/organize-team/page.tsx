'use client';

import Player from '@/components/Player/Player';
import clsx from 'clsx';
import { useAsyncEffect, useUser } from '@/utils/hooks';
import { useEffect, useState } from 'react';
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
  const [showHelp, setShowHelpRefresState] = useState(false);
  const [ctrl, setCtrlState] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SelectedUser | undefined>();

  useEffect(() => {
    window.addEventListener('keydown', activateCtrlKey);
    window.addEventListener('keyup', deactivateCtrlKey);

    return () => {
      window.removeEventListener('keydown', activateCtrlKey);
      window.removeEventListener('keyup', deactivateCtrlKey);
    };
  }, []);

  useAsyncEffect(async () => {
    if (!user || !refresh) return;

    const params = new URLSearchParams();
    params.set('limit', '50');
    
    let resp: Response | undefined;
    let url = buildApiUrl(`/teams/${user.osu.country.code}/members?${params.toString()}`);

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

  function toggleHelp() {
    setShowHelpRefresState((state) => !state);
  }

  function activateCtrlKey(e: KeyboardEvent) {
    if (e.key !== 'Control') return;
    setCtrlState(true);
  }

  function deactivateCtrlKey(e: KeyboardEvent) {
    if (e.key !== 'Control') return;
    setCtrlState(false);
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
                      holdingCtrl={ctrl}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.backup}>
              <div className={styles.header}>Backup Players</div>
              <div className={styles.scroll}>
                <div className={styles.playersContainer}>
                  
                </div>
              </div>
            </div>
          </div>
          <div className={styles.candidates}>
            <div className={styles.header}>Candidates</div>
            <div className={styles.scroll}>
                <div className={styles.playersContainer}>
                  {team.candidates.results.map((player) => (
                    <Player
                      key={`candidates-${player.user_id}`}
                      player={player}
                      isSelected={player.user_id === selectedUser?.playerId}
                      onClick={() => onUserBtnClick(player.user_id, 'candidate')}
                      holdingCtrl={ctrl}
                    />
                  ))}
                </div>
              </div>
          </div>
        </div>
        <div className={styles.helpBtnContainer}>
          <button onClick={toggleHelp} className={styles.helpBtn}>
            ?
          </button>
        </div>
        {showHelp ? (
          <div className='backdrop'>
            <div className='modal'>
              <h2>Help</h2>
              <p>In this dashboard, you can organize your country's team. Players within "Roster" are part of the team while "Backup Players" are players that can be used to replace players within the roster in case they get screened. "Candidates" are registered players that you can choose to do nothing with or move them to the other previously mentioned categories.</p>
              <span><b>Things to consider</b></span>
              <ul>
                <li>- The roster must consist of <b>at least 5</b> players, and <b>at most 8</b>.</li>
                <li>- You can have no backup players if you so chooose to, but you <b>can't have more than 3</b>.</li>
                <li>- Click on a player to select or de-select them. If you want to visit a user's profile, click on them while holding <b>Ctrl</b>.</li>
              </ul>
              <div className='btn-container'>
                <button className='btn' onClick={toggleHelp}>
                  Got It
                </button>
              </div>
            </div>
          </div>
        ) : undefined}
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
