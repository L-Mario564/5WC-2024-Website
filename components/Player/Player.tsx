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
  onClick: () => void;
}

function PlayerContent({ player, holdingCtrl }: Pick<Props, 'player' | 'holdingCtrl'>) {
  return (
    <>
      <Image
        className={styles.pfp}
        alt={`pfp-${player.user_id}`}
        src={`https://a.ppy.sh/${player.osu_user_id}`}
        width={48}
        height={48}
      />
      <div className={styles.playerInfo}>
        <span className={styles.osu}>{player.osu_username}</span>
        <span className={styles.rank}>{formatRank(player.rank_standard ?? 0)} | BWS: {formatRank(player.rank_standard_bws ?? 0)}</span>
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

export default function Player({ player, onClick, isSelected, holdingCtrl }: Props) {
  const className = clsx(styles.player, isSelected ? styles.selectedPlayer : styles.notSelectedPlayer);

  return holdingCtrl ? (
    <a className={className} href={`https://osu.ppy.sh/users/${player.osu_user_id}`}>
      <PlayerContent player={player} holdingCtrl={holdingCtrl} />
    </a>
  ) : (
    <button className={className} onClick={onClick}>
      <PlayerContent player={player} holdingCtrl={holdingCtrl} />
    </button>
  );
}