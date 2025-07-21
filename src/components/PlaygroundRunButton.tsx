import React from "react"

import PlayIcon from "./icons/PlayIcon"
import LoadingIcon from "./icons/LoadingIcon"
import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundRunButtonProps {
  readonly onClick: () => void
  readonly disabled: boolean
  readonly theme: "dark" | "light" | "auto"
}

const PlaygroundRunButton: React.FC<PlaygroundRunButtonProps> = ({onClick, disabled, theme}) => {
  return (
    <button className={styles.runButton} onClick={onClick} disabled={disabled} title="Run code">
      {disabled ? (
        <LoadingIcon size={18} className={styles.loadingIcon} />
      ) : (
        <PlayIcon size={18} color={theme === "dark" ? "rgb(22 109 54 / 65%" : "#f2fcf3"} />
      )}
    </button>
  )
}

export default PlaygroundRunButton
