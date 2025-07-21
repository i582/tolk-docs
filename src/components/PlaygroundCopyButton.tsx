import React from "react"

import {CopyButton} from "./CopyButton/CopyButton.tsx"

import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundCopyButtonProps {
    readonly code: string
}

const PlaygroundCopyButton: React.FC<PlaygroundCopyButtonProps> = ({code}) => {
    return (
        <div className={styles.copyButton}>
            <CopyButton className={styles.cellItemCopyButton} title="Copy code" value={code} />
        </div>
    )
}

export default PlaygroundCopyButton
