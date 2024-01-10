import Image from 'next/image';
import Discord from '@/components/Discord/Discord';
import type { Player as PlayerT } from '@/utils/types';
import styles from './Player.module.scss';
import clsx from 'clsx';

type Props = {
  player: PlayerT;
  isSelected?: boolean;
  onClick: () => void;
}

export default function Player({ player, onClick, isSelected }: Props) {
  return (
    <button className={clsx(styles.player, isSelected ? styles.selectedPlayer : styles.notSelectedPlayer)} onClick={onClick}>
      <Image
        className={styles.pfp}
        alt={`pfp-${player.user_id}`}
        src={`https://a.ppy.sh/${player.osu_user_id}`}
        width={48}
        height={48}
      />
      <div className={styles.playerInfo}>
        <span className={styles.osu}>{player.osu_username}</span>
        <span className={styles.discord}>
          <Discord className={styles.discordIcon} /> {player.discord_username}
        </span>
      </div>
    </button>
  );
}