import {runTolkCompiler} from "@ton/tolk-js"
import {Cell} from "@ton/core"

export const compileTolkCode = async (code: string): Promise<Cell | undefined> => {
    const result = await runTolkCompiler({
        entrypointFileName: "main.tolk",
        fsReadCallback: () => code,
        withStackComments: true,
        withSrcLineComments: true,
    })
    if (result.status === "error") {
        return undefined
    }
    return Cell.fromBase64(result.codeBoc64)
}
