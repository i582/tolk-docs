import React, {useState} from "react"
import PlaygroundEditor from "./PlaygroundEditor"
import PlaygroundRunButton from "./PlaygroundRunButton"
import PlaygroundCopyButton from "./PlaygroundCopyButton"
import PlaygroundTerminal from "./PlaygroundTerminal"
import styles from "./InlinePlaygroundComponent.module.css"
import {useStarlightTheme} from "./useStarlightTheme.tsx"

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
    const theme = useStarlightTheme()
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
            const {compileAndExecuteTolk} = await import("./playground-runtime")

            setTerminalOutput("Starting compilation...")

            const result = await compileAndExecuteTolk(code)

            if (result.compilation.success && result.execution) {
                if (result.execution.success) {
                    setTerminalOutput(`${result.execution?.output}\n`)
                } else {
                    setTerminalOutput(
                        prev =>
                            prev +
                            `✗ Execution failed: ${result.execution?.error ?? "Unknown error"}\n`,
                    )
                }
            } else {
                setTerminalOutput(
                    prev => prev + `✗ Compilation failed: ${result.compilation.error}\n`,
                )
            }
        } catch (error) {
            console.error("Runtime error:", error)
            setTerminalOutput(prev => prev + `✗ Runtime error: ${error}\n`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className={`not-content ${styles.playground} ${theme === "dark" ? styles.playgroundDark : styles.playgroundLight}`}
        >
            <PlaygroundEditor code={code} onChange={setCode} theme={theme} />

            <PlaygroundRunButton onClick={runCode} disabled={isLoading || isBundleLoading} />

            <PlaygroundCopyButton code={code} />

            <PlaygroundTerminal
                isOpen={isTerminalOpen}
                onClose={() => setIsTerminalOpen(false)}
                output={terminalOutput}
                isLoading={isLoading}
                isDarkTheme={theme === "dark"}
            />
        </div>
    )
}

export default InlinePlaygroundComponent
