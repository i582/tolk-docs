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

const DEFAULT_CODE = `fun add(a: int, b: int) { return a + b }

fun main(): int {
    return add(12, 25);
}`

const InlinePlaygroundComponent: React.FC<InlinePlaygroundComponentProps> = ({
    children,
    initialCode = DEFAULT_CODE,
    code: codeProp,
}) => {
    const getInitialCode = () => {
        if (codeProp) return codeProp
        if (typeof children === "string") return children
        if (
            React.isValidElement(children) &&
            typeof children.props === "object" &&
            children.props !== null &&
            "value" in children.props &&
            typeof children.props.value === "string"
        ) {
            return children.props.value ?? initialCode
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
        setTerminalOutput("Loading Tolk runtime...\n")

        try {
            // Динамически загружаем runtime модуль
            await import("./playground-runtime")
            setBundleLoaded(true)
            setTerminalOutput(prev => prev + "Runtime loaded successfully!\n")
        } catch (error) {
            console.error("Failed to load runtime:", error)
            setTerminalOutput(prev => prev + `Failed to load runtime: ${error}\n`)
            setTerminalOutput(prev => prev + "Note: Runtime loading works in production build.\n")
            throw error
        } finally {
            setIsBundleLoading(false)
        }
    }

    const runCode = async () => {
        if (!bundleLoaded) {
            setIsTerminalOpen(true)
            try {
                await loadBundle()
            } catch (error) {
                setIsLoading(false)
                return
            }
        }

        setIsLoading(true)
        setIsTerminalOpen(true)
        setTerminalOutput("")

        try {
            // Динамически импортируем и выполняем
            const {compileAndExecuteTolk} = await import("./playground-runtime")

            setTerminalOutput(prev => prev + "Starting compilation...\n")

            const result = await compileAndExecuteTolk(code)

            if (result.compilation.success) {
                setTerminalOutput(prev => prev + `✓ ${result.compilation.output}\n`)

                if (result.execution) {
                    setTerminalOutput(prev => prev + "Executing...\n")

                    if (result.execution.success) {
                        setTerminalOutput(prev => prev + `✓ ${result.execution?.output}\n`)
                    } else {
                        setTerminalOutput(
                            prev =>
                                prev +
                                `✗ Execution failed: ${result.execution?.error ?? "Unknown error"}\n`,
                        )
                    }
                }
            } else {
                setTerminalOutput(
                    prev => prev + `✗ Compilation failed: ${result.compilation.error}\n`,
                )
            }

            setTerminalOutput(prev => prev + "\nExecution completed.\n")
        } catch (error) {
            console.error("Runtime error:", error)
            setTerminalOutput(prev => prev + `✗ Runtime error: ${error}\n`)
        } finally {
            setIsLoading(false)
        }
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
