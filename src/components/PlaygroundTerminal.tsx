import React from "react"

import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundTerminalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly output: string
  readonly isLoading: boolean
  readonly isDarkTheme: boolean
}

const PlaygroundTerminal: React.FC<PlaygroundTerminalProps> = ({
  isOpen,
  onClose,
  output,
  isLoading,
  isDarkTheme,
}) => {
  if (!isOpen) return null

  return (
    <div
      className={`${styles.terminal} ${isDarkTheme ? styles.terminalDark : styles.terminalLight}`}
    >
      <div
        className={`${styles.terminalHeader} ${isDarkTheme ? styles.terminalHeaderDark : styles.terminalHeaderLight}`}
      >
        <span className={styles.terminalLabel}>Output</span>
        <button className={styles.closeButton} onClick={onClose} title="Close terminal">
          ✕
        </button>
      </div>
      <div
        className={`${styles.terminalContent} ${isDarkTheme ? styles.terminalContentDark : styles.terminalContentLight}`}
      >
        <pre className={styles.terminalPre}>{output}</pre>
        {isLoading && <span className={styles.cursor}>█</span>}
      </div>
    </div>
  )
}

export default PlaygroundTerminal
