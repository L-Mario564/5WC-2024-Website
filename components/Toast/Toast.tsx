"use client"
import styles from './Toast.module.scss'

export default function Toast({data}: {data: any}) {
  return (
    <div className={styles.toast}>
      <div className={styles.code}>Error: {data?.statusCode}</div>
      <div className={styles.text}>{data?.statusText}</div>
    </div>
  )
}
