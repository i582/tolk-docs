import "./polyfills"

import type {Cell, TupleItem, TupleReader} from "@ton/core"

import {compileTolkCode} from "./compile-tolk"
import {executeCell} from "./execute"

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

    return stepExecuteCode(codeCell, {success: true})
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

    const stackItems = tupleReaderToStack(stack)

    const output =
      stackItems.length > 0 ? serializeStack(stackItems) : "Execution completed (empty stack)"

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

export type Stack = readonly StackElement[]

export type StackElement =
  | {readonly $: "Null"}
  | {readonly $: "Integer"; readonly value: bigint}
  | {readonly $: "Cell"; readonly boc: string}
  | {
      readonly $: "Slice"
      readonly hex: string
      readonly startBit: number
      readonly endBit: number
      readonly startRef: number
      readonly endRef: number
    }
  | {readonly $: "Builder"; readonly hex: string}
  | {readonly $: "Continuation"; readonly name: string}
  | {readonly $: "Address"; readonly value: string}
  | {readonly $: "Tuple"; readonly elements: readonly StackElement[]}
  | {readonly $: "Unknown"; readonly value: string}

export const itemToStackElement = (el: TupleItem): StackElement => {
  if (el.type === "int") {
    return {
      $: "Integer",
      value: el.value,
    }
  } else if (el.type === "null") {
    return {
      $: "Null",
    }
  } else if (el.type === "tuple") {
    return {
      $: "Tuple",
      elements: el.items.map(it => itemToStackElement(it)),
    }
  } else if (el.type === "cell") {
    return {
      $: "Cell",
      boc: el.cell.toBoc().toString("hex"),
    }
  } else if (el.type === "builder") {
    return {
      $: "Builder",
      hex: el.cell.toBoc().toString("hex"),
    }
  } else if (el.type === "slice") {
    return {
      $: "Slice",
      hex: el.cell.toBoc().toString("hex"),
      startBit: 0,
      endBit: el.cell.bits.length,
      startRef: 0,
      endRef: el.cell.refs.length,
    }
  } else if (el.type === "nan") {
    return {
      $: "Unknown",
      value: "NaN",
    }
  }

  return {
    $: "Unknown",
    value: "",
  }
}

export const tupleReaderToStack = (b: TupleReader): Stack => {
  const res: StackElement[] = []
  while (b.remaining) {
    const el = b.pop()
    res.push(itemToStackElement(el))
  }
  return res
}

export const serializeStack = (stack: Stack): string => {
  return "[" + stack.map(it => serializeStackElement(it)).join(" ") + "]"
}

export const serializeStackElement = (element: StackElement): string => {
  switch (element.$) {
    case "Null":
      return "()"
    case "Integer":
      return element.value.toString()
    case "Tuple":
      return "[" + element.elements.map(it => serializeStackElement(it)).join(", ") + "]"
    case "Unknown":
      return element.value
    case "Cell":
      return "C{" + element.boc + "}"
    case "Continuation":
      return "Cont{" + element.name + "}"
    case "Builder":
      return "BC{" + element.hex + "}"
    case "Slice":
      if (element.startBit === 0 && element.endBit === 0) {
        return "CS{" + element.hex + "}"
      }
      return (
        "CS{Cell{" +
        element.hex +
        "} bits:" +
        element.startBit +
        ".." +
        element.endBit +
        ";" +
        "refs:" +
        element.startRef +
        ".." +
        element.endRef +
        "}"
      )
    case "Address":
      return "CS{" + element.value + "}"
  }
}

export {compileTolkCode, executeCell}
