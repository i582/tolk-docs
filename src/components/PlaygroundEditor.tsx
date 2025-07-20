import React, {useRef, useEffect} from "react"
import {EditorView} from "@codemirror/view"
import {EditorState} from "@codemirror/state"
import {oneDark} from "@codemirror/theme-one-dark"
import {history} from "@codemirror/commands"
import {highlightSelectionMatches} from "@codemirror/search"
import {
    indentOnInput,
    bracketMatching,
    syntaxHighlighting,
    defaultHighlightStyle,
} from "@codemirror/language"
import {
    lineNumbers,
    highlightActiveLineGutter,
    drawSelection,
    dropCursor,
    highlightActiveLine,
} from "@codemirror/view"
import {tolk} from "./lang-tolk"

interface PlaygroundEditorProps {
    readonly code: string
    readonly onChange: (code: string) => void
    readonly isDarkTheme: boolean
}

const PlaygroundEditor: React.FC<PlaygroundEditorProps> = ({code, onChange, isDarkTheme}) => {
    const editorRef = useRef<HTMLDivElement>(null)
    const viewRef = useRef<EditorView | null>(null)

    useEffect(() => {
        if (!editorRef.current) return

        const basicExtensions = [
            lineNumbers(),
            highlightActiveLineGutter(),
            history(),
            drawSelection(),
            dropCursor(),
            indentOnInput(),
            bracketMatching(),
            highlightActiveLine(),
            highlightSelectionMatches(),
        ]

        const view = new EditorView({
            state: EditorState.create({
                doc: code,
                extensions: [
                    ...basicExtensions,
                    tolk(),
                    syntaxHighlighting(defaultHighlightStyle, {fallback: true}),
                    isDarkTheme ? oneDark : [],
                    EditorView.updateListener.of(update => {
                        if (update.docChanged) {
                            onChange(update.state.doc.toString())
                        }
                    }),
                    EditorView.theme({
                        "&": {
                            fontSize: "14px",
                            fontFamily:
                                "'JetBrains Mono', 'Fira Code', 'Menlo', 'Consolas', 'DejaVu Sans Mono', monospace",
                        },
                        ".cm-focused": {
                            outline: "none",
                        },
                        ".cm-line": {
                            marginTop: "0",
                        },
                        ".cm-gutterElement": {
                            marginTop: "0",
                        },
                    }),
                ],
            }),
            parent: editorRef.current,
        })

        viewRef.current = view

        return () => {
            view.destroy()
        }
    }, [isDarkTheme])

    useEffect(() => {
        if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
            viewRef.current.dispatch({
                changes: {
                    from: 0,
                    to: viewRef.current.state.doc.length,
                    insert: code,
                },
            })
        }
    }, [code])

    return <div ref={editorRef} />
}

export default PlaygroundEditor
