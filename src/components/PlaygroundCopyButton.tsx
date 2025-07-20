import React from "react"
import CopyIcon from "./icons/CopyIcon"
import CheckIcon from "./icons/CheckIcon"
import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundCopyButtonProps {
    readonly onClick: () => void
    readonly copied: boolean
}

const PlaygroundCopyButton: React.FC<PlaygroundCopyButtonProps> = ({onClick, copied}) => {
    return (
        <button
            className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ""}`}
            onClick={onClick}
            title={copied ? "Copied!" : "Copy code"}
        >
            {copied ? <CheckIcon size={14} color="#22c55e" /> : <CopyIcon size={14} />}
        </button>
    )
}

export default PlaygroundCopyButton
