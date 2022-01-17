import { format, formatDistanceToNow, parseISO } from 'date-fns'

import AppLink from './link'

import styles from './article.module.css'

export interface ArticleProps {
  content: string
  editUrl: string
  lastChange: string
}

export default function Article({ content, editUrl, lastChange }: ArticleProps) {
  const time = parseISO(lastChange)
  const timeHumanReadable = format(time, 'd/MM/y, HH:mm:ss')
  const timeDistance = formatDistanceToNow(time)

  return (
    <>
      <article className={styles.article} dangerouslySetInnerHTML={{ __html: content }} />

      <footer className={styles.footer}>
        <time dateTime={lastChange} title={timeHumanReadable} className={styles.footerLastChange}>
          Last change: {timeDistance} ago
        </time>

        <div className={styles.footerEdit}>
          <AppLink external href={editUrl}>
            Edit this page on GitHub
          </AppLink>
        </div>
      </footer>
    </>
  )
}
