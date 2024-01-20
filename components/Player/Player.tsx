import clsx from 'clsx';
import Image from 'next/image';
import Discord from '@/components/Discord/Discord';
import { ExternalLink } from 'lucide-react';
import { formatRank } from '@/utils';
import type { Player as PlayerT } from '@/utils/types';
import styles from './Player.module.scss';

type Props = {
  player: PlayerT;
  isSelected?: boolean;
  holdingCtrl: boolean;
  disableWhenInRoster?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function PlayerContent({ player, holdingCtrl }: Pick<Props, 'player' | 'holdingCtrl'>) {
  return (
    <>
      <Image
        className={styles.pfp}
        alt={`pfp-${player.user_id}`}
        src={`https://a.ppy.sh/${player.osu_user_id}`}
        width={56}
        height={56}
      />
      <div className={styles.playerInfo}>
        <span className={styles.osu}>{player.osu_username}</span>
        <span className={styles.rank}>
          {formatRank(player.rank_standard ?? 0)} | BWS: {formatRank(player.rank_standard_bws ?? 0)}
        </span>
        <span className={styles.discord}>
          <Discord className={styles.discordIcon} /> {player.discord_username}
        </span>
      </div>
      {holdingCtrl ? (
        <ExternalLink width={20} height={20} className={styles.externalLinkIcon} />
      ) : undefined}
    </>
  );
}

export default function Player({
  player,
  onClick,
  isSelected,
  holdingCtrl,
  disableWhenInRoster,
  disabled
}: Props) {
  const className = clsx(
    styles.player,
    isSelected ? styles.selectedPlayer : styles.notSelectedPlayer
  );

  return (
    <div className={styles.container}>
      {(player.in_roster || player.in_backup_roster) && disableWhenInRoster ? (
        holdingCtrl ? (
          <a
            className={styles.disabledText}
            href={`https://osu.ppy.sh/users/${player.osu_user_id}`}
          >
            {player.in_roster ? 'Roster' : 'Backup'}
          </a>
        ) : (
          <div className={clsx(styles.disabledText, styles.notAllowedCursor)}>
            {player.in_roster ? 'Roster' : 'Backup'}
          </div>
        )
      ) : undefined}
      {holdingCtrl ? (
        <a
          className={clsx(
            className,
            ((player.in_roster || player.in_backup_roster) && disableWhenInRoster) ?? disabled
              ? styles.playerDisabled
              : undefined
          )}
          href={`https://osu.ppy.sh/users/${player.osu_user_id}`}
        >
          <PlayerContent player={player} holdingCtrl={holdingCtrl} />
        </a>
      ) : (
        <button
          className={className}
          onClick={onClick}
          disabled={
            ((player.in_roster || player.in_backup_roster) && disableWhenInRoster) ?? disabled
          }
        >
          <PlayerContent player={player} holdingCtrl={holdingCtrl} />
        </button>
      )}
    </div>
  );
}
