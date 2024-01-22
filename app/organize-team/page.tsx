'use client';
import Player from '@/components/Player/Player';
import clsx from 'clsx';
import { useAsyncEffect, useError, useUser } from '@/utils/hooks';
import { useEffect, useState } from 'react';
import { teamSchema } from '@/utils/schemas';
import { buildApiUrl, env, formatTimeLeft, getCsrfToken } from '@/utils';
import type { Team } from '@/utils/types';
import styles from './organize-team.module.scss';

type PlayerType = 'roster' | 'backup' | 'candidate';

export default function OrganizeTeamPage() {
  const user = useUser();
  const [team, setTeam] = useState<Team | undefined>();
  const [refresh, setRefreshState] = useState(true);
  const [showHelp, setShowHelpRefresState] = useState(false);
  const [ctrl, setCtrlState] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectingFrom, setSelectingFrom] = useState<PlayerType | undefined>();
  const { setError } = useError();
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [pages, setPages] = useState<number[]>([]);
  const maxSelect = 10;
  const fetchLimit = 50;

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

    let resp: Response | undefined;
    const url = buildApiUrl(
      `/teams/${user.osu.country.code}/members?limit=${fetchLimit}&page=${page}`
    );

    try {
      resp = await fetch(url, {
        credentials: 'include'
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const message = 'Failed to get team data';
      const data = await resp?.text();

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message,
        statusCode: resp?.status
      });
      return;
    }

    const data = await resp.text();
    const parsedTeam = teamSchema.safeParse(JSON.parse(data));

    if (!parsedTeam.success) {
      const message = `Server (at "${url}") sent a response different than the one expected while getting the team data`;

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message
      });
      return;
    }

    setRefreshState(false);
    setTeam(parsedTeam.data);
    setPageCount(Math.ceil(parsedTeam.data.candidates.count / fetchLimit));
  }, [user, refresh]);

  useEffect(() => {
    if (selectedUserIds.length === 0 && selectingFrom) {
      setSelectingFrom(undefined);
    }
  }, [selectedUserIds, selectingFrom]);

  useEffect(() => {
    if (pageCount === 0) {
      setPages([]);
      return;
    }

    const start = Math.max(1, page - 3);
    const end = Math.min(page + 3, pageCount);

    const startDifference = Math.max(1 - start, 0);
    const endDifference = Math.max(end - pageCount, 0);

    let adjustedStart = start + endDifference;
    let adjustedEnd = end - startDifference;

    const pages: number[] = [];

    for (let i = adjustedStart; i <= adjustedEnd; i++) {
      pages.push(i);
    }

    while (pages.length < 7 && adjustedStart > 1) {
      pages.unshift(--adjustedStart);
    }

    while (pages.length < 7 && adjustedEnd < pageCount) {
      pages.push(++adjustedEnd);
    }

    setPages(pages);
  }, [page, pageCount]);

  function onUserBtnClick(playerUserId: number, as: PlayerType) {
    if (!selectingFrom) {
      setSelectingFrom(as);
    }

    if (selectingFrom && selectingFrom !== as) return;

    setSelectedUserIds((userIds) => {
      if (userIds.includes(playerUserId)) {
        userIds = userIds.filter((userId) => userId !== playerUserId);
        return [...userIds];
      }

      if (selectedUserIds.length < maxSelect) {
        return [...userIds, playerUserId];
      }

      return userIds;
    });
  }

  function deselectAll() {
    setSelectedUserIds([]);
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

  async function updateTeam(players: number[], backups: number[], movingTo: PlayerType) {
    let msgIfError = '';

    if (movingTo === 'roster') {
      if (players.length > env.NEXT_PUBLIC_TEAM_MAX_PLAYERS) {
        setError({
          info: `Move less players to meet the maximum roster size of ${env.NEXT_PUBLIC_TEAM_MAX_PLAYERS}`
        });
        return;
      }

      if (players.length < env.NEXT_PUBLIC_TEAM_MIN_PLAYERS) {
        setError({
          info: `Move more players to meet the minimmum roster size of ${env.NEXT_PUBLIC_TEAM_MIN_PLAYERS}`
        });
        return;
      }

      msgIfError = 'Failed to move player to roster';
    } else if (movingTo === 'backup') {
      if (players.length < env.NEXT_PUBLIC_TEAM_MIN_PLAYERS) {
        setError({
          info: 'Form the roster before backing up players'
        });
        return;
      }

      if (backups.length > env.NEXT_PUBLIC_TEAM_MAX_BACKUPS) {
        setError({
          info: `Move less players to meet the maximum amount of ${env.NEXT_PUBLIC_TEAM_MAX_BACKUPS} backup players`
        });
        return;
      }

      if (backups.length < env.NEXT_PUBLIC_TEAM_MIN_BACKUPS) {
        setError({
          info: `Move more players to meet the minimmum amount of ${env.NEXT_PUBLIC_TEAM_MIN_BACKUPS} backup players`
        });
        return;
      }

      msgIfError = 'Failed to move player to backup roster';
    } else {
      if (players.length < env.NEXT_PUBLIC_TEAM_MIN_PLAYERS) {
        setError({
          info: `Move less players to meet the minimmum roster size of ${env.NEXT_PUBLIC_TEAM_MIN_PLAYERS}`
        });
        return;
      }

      if (backups.length < env.NEXT_PUBLIC_TEAM_MIN_BACKUPS) {
        setError({
          info: `Move less players to meet the minimmum amount of ${env.NEXT_PUBLIC_TEAM_MIN_BACKUPS} backup players`
        });
        return;
      }

      msgIfError = 'Failed to move player to list of candidates';
    }

    const csrf = getCsrfToken();

    if (!csrf) {
      console.warn('CSRF token not found. Stopping execution');
      return;
    }

    let resp: Response | undefined;
    const url = buildApiUrl(
      `/teams/${user?.osu.country.code}/members/?limit=${fetchLimit}&page=${page}`
    );
    const body = JSON.stringify({ players, backups });

    try {
      resp = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        body,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrf
        }
      });
    } catch (err) {
      console.error(err);
    }

    if (!resp?.ok) {
      const data = await resp?.text();

      console.error(msgIfError);
      console.info('Response: ' + data);

      setError({
        info: msgIfError,
        statusCode: resp?.status
      });
      return;
    }

    setSelectedUserIds([]);

    const data = await resp.text();
    const parsedTeam = teamSchema.safeParse(JSON.parse(data));

    if (!parsedTeam.success) {
      const message = `Server (at "${url}") sent a response different than the one expected while updating the team data`;

      console.error(message);
      console.info('Response: ' + data);

      setError({
        info: message
      });
      return;
    }

    setTeam(parsedTeam.data);
    setPageCount(Math.ceil(parsedTeam.data.candidates.count / fetchLimit));
  }

  function mapToUserId(player: { user_id: number }) {
    return player.user_id;
  }

  function filterSelectedIds(id: number) {
    return !selectedUserIds.includes(id);
  }

  async function candidateToRoster() {
    if (!team) return;
    const players = team.roster.map(mapToUserId).concat(selectedUserIds);
    const backups = team.backups.map(mapToUserId);
    await updateTeam(players, backups, 'roster');
  }

  async function candidateToBackup() {
    if (!team) return;
    const players = team.roster.map(mapToUserId);
    const backups = team.backups.map(mapToUserId).concat(selectedUserIds);
    await updateTeam(players, backups, 'backup');
  }

  async function rosterToCandidate() {
    if (!team) return;
    const players = team.roster.map(mapToUserId).filter(filterSelectedIds);
    const backups = team.backups.map(mapToUserId);
    await updateTeam(players, backups, 'candidate');
  }

  async function rosterToBackup() {
    if (!team) return;
    const players = team.roster.map(mapToUserId).filter(filterSelectedIds);
    const backups = team.backups.map(mapToUserId).concat(selectedUserIds);
    await updateTeam(players, backups, 'backup');
  }

  async function backupToCandidate() {
    if (!team) return;
    const players = team.roster.map(mapToUserId);
    const backups = team.backups.map(mapToUserId).filter(filterSelectedIds);
    await updateTeam(players, backups, 'candidate');
  }

  async function backupToRoster() {
    if (!team) return;
    const players = team.roster.map(mapToUserId).concat(selectedUserIds);
    const backups = team.backups.map(mapToUserId).filter(filterSelectedIds);
    await updateTeam(players, backups, 'roster');
  }

  function changePage(n: number) {
    if (n === page) return;
    setPage(n);
    setRefreshState(true);
  }

  return !user ? (
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
        <div className={styles.timeLeft}>
          {env.NEXT_PUBLIC_REGISTRATION_END_DATE.getTime() > new Date().getTime()
            ? `You have ${formatTimeLeft(
                env.NEXT_PUBLIC_REGISTRATION_END_DATE
              )} left to set your roster and backup players`
            : 'You can no longer make any changes to your roster or backup players'}
        </div>
        <div className={styles.teamContainer}>
          <div className={styles.roster}>
            <div className={styles.header}>Roster</div>
            <div className={styles.scroll}>
              <div className={styles.playersContainer}>
                {team.roster.map((player) => (
                  <Player
                    key={`roster-${player.user_id}`}
                    player={player}
                    isSelected={
                      selectedUserIds.includes(player.user_id) && selectingFrom === 'roster'
                    }
                    onClick={() => onUserBtnClick(player.user_id, 'roster')}
                    holdingCtrl={ctrl}
                    disabled={selectingFrom && selectingFrom !== 'roster'}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className={styles.backup}>
            <div className={styles.header}>Backup Players</div>
            <div className={styles.scroll}>
              <div className={styles.playersContainer}>
                {team.backups.map((player) => (
                  <Player
                    key={`backups-${player.user_id}`}
                    player={player}
                    isSelected={
                      selectedUserIds.includes(player.user_id) && selectingFrom === 'backup'
                    }
                    onClick={() => onUserBtnClick(player.user_id, 'backup')}
                    holdingCtrl={ctrl}
                    disabled={selectingFrom && selectingFrom !== 'backup'}
                  />
                ))}
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
                  isSelected={
                    selectedUserIds.includes(player.user_id) && selectingFrom === 'candidate'
                  }
                  onClick={() => onUserBtnClick(player.user_id, 'candidate')}
                  holdingCtrl={ctrl}
                  disabled={selectingFrom && selectingFrom !== 'candidate'}
                  disableWhenInRoster
                />
              ))}
            </div>
          </div>
          {pages.length > 1 ? (
            <div className={styles.pagination}>
              {pages.map((pageNumber) => (
                <button
                  key={`page-${pageNumber}`}
                  className={clsx(page === pageNumber ? 'btn btn-primary' : 'btn', styles.pageBtn)}
                  onClick={() => changePage(pageNumber)}
                >
                  {pageNumber}
                </button>
              ))}
            </div>
          ) : undefined}
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
            <p>
              In this dashboard, you can organize your country&apos;s team. Players within
              &quot;Roster&quot; are part of the team while &quot;Backup Players&quot; are players
              that can be used to replace players within the roster in case they get screened.
              &quot;Candidates&quot; are registered players that you can choose to do nothing with
              or move them to the other previously mentioned categories.
            </p>
            <span>
              <b>Things to consider</b>
            </span>
            <ul>
              <li>
                - The roster must consist of <b>at least 5</b> players, and <b>at most 8</b>.
              </li>
              <li>
                - You can have no backup players if you so chooose to, but you{' '}
                <b>can&apos;t have more than 3</b>.
              </li>
              <li>
                - Click on a player to select or deselect them. If you want to visit a user&apos;s
                profile, click on them while holding <b>Ctrl</b>.
              </li>
            </ul>
            <div className='btn-container'>
              <button className='btn' onClick={toggleHelp}>
                Got It
              </button>
            </div>
          </div>
        </div>
      ) : undefined}
      {selectedUserIds.length > 0 && (
        <div className={styles.modalContainer}>
          <div className={clsx('modal', styles.modal)}>
            <span className={styles.counter}>
              {selectedUserIds.length} / {maxSelect}
            </span>
            {selectingFrom === 'candidate' ? (
              <>
                <button onClick={candidateToRoster} className='btn'>
                  Roster
                </button>
                <button onClick={candidateToBackup} className='btn'>
                  Backup
                </button>
              </>
            ) : selectingFrom === 'backup' ? (
              <>
                <button onClick={backupToCandidate} className='btn'>
                  Candidate
                </button>
                <button onClick={backupToRoster} className='btn'>
                  Roster
                </button>
              </>
            ) : (
              <>
                <button onClick={rosterToCandidate} className='btn'>
                  Candidate
                </button>
                <button onClick={rosterToBackup} className='btn'>
                  Backup
                </button>
              </>
            )}
            <button onClick={deselectAll} className='btn btn-error'>
              Deselect
            </button>
          </div>
        </div>
      )}
    </>
  );
}
