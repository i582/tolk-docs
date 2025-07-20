import "./polyfills"

import {compileTolkCode} from "./compile-tolk"
import {executeCell} from "./execute"
import type {Cell} from "@ton/core"

export interface CompilationResult {
    readonly success: boolean
    readonly error?: string
    readonly output?: string
}

export interface ExecutionResult {
    readonly success: boolean
    readonly output: string
    readonly error?: string
    readonly vmLogs?: string
}

export async function compileAndExecuteTolk(code: string): Promise<{
    compilation: CompilationResult
    execution?: ExecutionResult
}> {
    try {
        const codeCell = await compileTolkCode(code)

        if (!codeCell) {
            return {
                compilation: {
                    success: false,
                    error: "Compilation failed: invalid code",
                },
            }
        }

        const compilationResult: CompilationResult = {
            success: true,
            output: "Code compiled successfully!",
        }

        return stepExecuteCode(codeCell, compilationResult)
    } catch (error) {
        return {
            compilation: {
                success: false,
                error: error instanceof Error ? error.message : "Compilation failed",
            },
        }
    }
}

async function stepExecuteCode(codeCell: Cell, compilationResult: CompilationResult) {
    try {
        const [stack, vmLogs] = await executeCell(codeCell, 0)

        const stackItems = []
        const reader = stack

        try {
            while (reader.remaining > 0) {
                try {
                    const item = reader.readBigNumber()
                    stackItems.push(item.toString())
                } catch {
                    try {
                        const item = reader.readCell()
                        stackItems.push(`Cell(${item.bits.length} bits)`)
                    } catch {
                        try {
                            const item = reader.readString()
                            stackItems.push(`"${item}"`)
                        } catch {
                            stackItems.push("Unknown type")
                            reader.skip(1)
                        }
                    }
                }
            }
        } catch (e) {}

        const output =
            stackItems.length > 0
                ? `Stack result: [${stackItems.join(", ")}]`
                : "Execution completed (empty stack)"

        return {
            compilation: compilationResult,
            execution: {
                success: true,
                output,
                vmLogs,
            },
        }
    } catch (error) {
        return {
            compilation: compilationResult,
            execution: {
                success: false,
                output: "",
                error: error instanceof Error ? error.message : "Execution failed",
            },
        }
    }
}

export {compileTolkCode, executeCell}
