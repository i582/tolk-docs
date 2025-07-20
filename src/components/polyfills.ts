import {Buffer} from "buffer"

if (typeof globalThis !== "undefined" && !globalThis.Buffer) {
    ;(globalThis as any).Buffer = Buffer
    ;(globalThis as any).process = {
        env: {},
        version: "",
        platform: "browser",
    }
}

export {}
