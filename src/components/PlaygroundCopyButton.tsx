import React, {useState} from "react"
import CopyIcon from "./icons/CopyIcon"
import CheckIcon from "./icons/CheckIcon"
import styles from "./InlinePlaygroundComponent.module.css"

interface PlaygroundCopyButtonProps {
    readonly code: string
}

const PlaygroundCopyButton: React.FC<PlaygroundCopyButtonProps> = ({code}) => {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    return (
        <button
            className={`${styles.copyButton} ${copied ? styles.copyButtonSuccess : ""}`}
            onClick={copyToClipboard}
            title={copied ? "Copied!" : "Copy code"}
        >
            {copied ? <CheckIcon size={14} color="#22c55e" /> : <CopyIcon size={14} />}
        </button>
    )
}

export default PlaygroundCopyButton
