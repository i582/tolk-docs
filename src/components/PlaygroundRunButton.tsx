import React from "react"
import PlayIcon from "./icons/PlayIcon"
import LoadingIcon from "./icons/LoadingIcon"
import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundRunButtonProps {
    readonly onClick: () => void
    readonly isLoading: boolean
    readonly isBundleLoading: boolean
}

const PlaygroundRunButton: React.FC<PlaygroundRunButtonProps> = ({
    onClick,
    isLoading,
    isBundleLoading,
}) => {
    const disabled = isLoading || isBundleLoading

    return (
        <button className={styles.runButton} onClick={onClick} disabled={disabled} title="Run code">
            {disabled ? (
                <LoadingIcon size={18} className={styles.loadingIcon} />
            ) : (
                <PlayIcon size={18} color="#22c55e" />
            )}
        </button>
    )
}

export default PlaygroundRunButton
