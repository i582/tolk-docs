import React, {useState, useEffect} from "react"
import PlaygroundEditor from "./PlaygroundEditor"
import PlaygroundRunButton from "./PlaygroundRunButton"
import PlaygroundCopyButton from "./PlaygroundCopyButton"
import PlaygroundTerminal from "./PlaygroundTerminal"
import styles from "./InlinePlaygroundComponent.module.css"

interface InlinePlaygroundComponentProps {
    readonly children?: React.ReactNode
    readonly initialCode?: string
    readonly code?: string
}

const InlinePlaygroundComponent: React.FC<InlinePlaygroundComponentProps> = ({
    children,
    initialCode = `import "utils"

struct Storage {
    counter: int32
}

fun Storage.load() {
    return Storage.fromCell(contract.getData());
}

fun onInternalMessage(in: InMessage) {
    // ...
}

get fun currentCounter(): int {
    val storage = lazy Storage.load();
    return storage.counter;
}`,
    code: codeProp,
}) => {
    const getInitialCode = () => {
        if (codeProp) return codeProp
        if (typeof children === "string") return children
        if (
            React.isValidElement(children) &&
            typeof children.props === "object" &&
            children.props !== null &&
            "children" in children.props
        ) {
            return (children.props as any).children || initialCode
        }
        return initialCode
    }

    const [code, setCode] = useState(getInitialCode)
    const [isTerminalOpen, setIsTerminalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isBundleLoading, setIsBundleLoading] = useState(false)
    const [bundleLoaded, setBundleLoaded] = useState(false)
    const [terminalOutput, setTerminalOutput] = useState("")
    const [copied, setCopied] = useState(false)
    const [isDarkTheme, setIsDarkTheme] = useState(true)

    useEffect(() => {
        const checkTheme = () => {
            const computedStyle = getComputedStyle(document.documentElement)
            const bgColor = computedStyle.getPropertyValue("--sl-color-bg").trim()
            const textColor = computedStyle.getPropertyValue("--sl-color-text").trim()
            const isDark =
                bgColor.includes("dark") ||
                bgColor.includes("#") ||
                textColor.includes("white") ||
                textColor.includes("#fff")
            setIsDarkTheme(isDark)
        }

        checkTheme()
        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme", "class"],
        })

        return () => observer.disconnect()
    }, [])

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy:", err)
        }
    }

    const loadBundle = async () => {
        if (bundleLoaded) return

        setIsBundleLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setBundleLoaded(true)
        setIsBundleLoading(false)
    }

    const runCode = async () => {
        if (!bundleLoaded) {
            await loadBundle()
        }

        setIsLoading(true)
        setIsTerminalOpen(true)
        setTerminalOutput("Starting compilation...\n")

        await new Promise(resolve => setTimeout(resolve, 800))
        setTerminalOutput(prev => prev + "Compiling Tolk code...\n")

        await new Promise(resolve => setTimeout(resolve, 600))
        setTerminalOutput(prev => prev + "Code compiled successfully!\n")

        await new Promise(resolve => setTimeout(resolve, 400))
        setTerminalOutput(prev => prev + "Executing...\n")
        setTerminalOutput(prev => prev + "Hello from Tolk!\n")
        setTerminalOutput(prev => prev + "Number is: 42\n")
        setTerminalOutput(prev => prev + "Execution completed.\n")

        setIsLoading(false)
    }

    return (
        <div
            className={`not-content ${styles.playground} ${isDarkTheme ? styles.playgroundDark : styles.playgroundLight}`}
        >
            <PlaygroundEditor code={code} onChange={setCode} isDarkTheme={isDarkTheme} />

            <PlaygroundRunButton
                onClick={runCode}
                isLoading={isLoading}
                isBundleLoading={isBundleLoading}
            />

            <PlaygroundCopyButton onClick={copyToClipboard} copied={copied} />

            <PlaygroundTerminal
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                output={terminalOutput}
                isLoading={isLoading}
                isDarkTheme={isDarkTheme}
            />
        </div>
    )
}

export default InlinePlaygroundComponent
