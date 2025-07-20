import {LanguageSupport} from "@codemirror/language"
import {StreamLanguage} from "@codemirror/language"

const tolkKeywords = new Set([
    "tolk",
    "import",
    "global",
    "const",
    "type",
    "struct",
    "fun",
    "get",
    "asm",
    "builtin",
    "var",
    "val",
    "return",
    "repeat",
    "if",
    "else",
    "do",
    "while",
    "break",
    "continue",
    "throw",
    "assert",
    "try",
    "catch",
    "match",
    "as",
    "is",
    "lazy",
    "mutate",
    "redef",
])

const tolkBuiltins = new Set(["true", "false", "null"])

const tolkTypes = new Set([
    "int",
    "bool",
    "cell",
    "slice",
    "builder",
    "tuple",
    "cont",
    "dict",
    "address",
])

const tolkLanguage = StreamLanguage.define({
    name: "tolk",
    startState() {
        return {
            tokenize: tokenBase,
            context: null,
        }
    },
    token(stream, state) {
        return state.tokenize(stream, state)
    },
    languageData: {
        commentTokens: {line: "//", block: {open: "/*", close: "*/"}},
        indentOnInput: /^\s*[{}]$/,
        wordChars: "$",
    },
})

function tokenBase(stream: any, state: any) {
    if (stream.eatSpace()) return null

    const ch = stream.peek()

    if (ch === "/") {
        if (stream.match("//")) {
            stream.skipToEnd()
            return "comment"
        }
        if (stream.match("/*")) {
            state.tokenize = tokenComment
            return tokenComment(stream, state)
        }
    }

    if (ch === '"') {
        if (stream.match('"""')) {
            state.tokenize = tokenTripleString
            return tokenTripleString(stream, state)
        }
        stream.next()
        state.tokenize = tokenString
        return "string"
    }

    if (/\d/.test(ch)) {
        if (stream.match(/^0x[0-9a-fA-F]+/)) return "number"
        if (stream.match(/^0b[01]+/)) return "number"
        if (stream.match(/^\d+/)) return "number"
    }

    if (/[a-zA-Z_$]/.test(ch)) {
        if (ch === "`") {
            stream.next()
            while (stream.peek() && stream.peek() !== "`") {
                stream.next()
            }
            if (stream.peek() === "`") stream.next()
            return "variable"
        }

        stream.eatWhile(/[a-zA-Z0-9_$]/)
        const word = stream.current()

        if (tolkKeywords.has(word)) return "keyword"
        if (tolkBuiltins.has(word)) return "atom"
        if (tolkTypes.has(word)) return "type"
        if (/^[A-Z]/.test(word)) return "type"

        return "variable"
    }

    if (stream.match(/^(==|!=|<=|>=|<=>|&&|\|\||<<|>>|~>>|\^>>|->|=>)/)) {
        return "operator"
    }

    if (stream.match(/^(\+=|-=|\*=|\/=|%=|<<=|>>=|&=|\|=|\^=)/)) {
        return "operator"
    }

    if (/[+\-*\/%&|^<>=!~?]/.test(ch)) {
        stream.next()
        return "operator"
    }

    if (/[();,.\[\]{}:]/.test(ch)) {
        stream.next()
        return null
    }

    stream.next()
    return null
}

function tokenComment(stream: any, state: any) {
    let maybeEnd = false
    while (stream.peek()) {
        if (maybeEnd && stream.peek() === "/") {
            stream.next()
            state.tokenize = tokenBase
            break
        }
        maybeEnd = stream.peek() === "*"
        stream.next()
    }
    return "comment"
}

function tokenString(stream: any, state: any) {
    let escaped = false
    while (stream.peek()) {
        if (!escaped && stream.peek() === '"') {
            stream.next()
            state.tokenize = tokenBase
            break
        }
        escaped = !escaped && stream.peek() === "\\"
        stream.next()
    }
    return "string"
}

function tokenTripleString(stream: any, state: any) {
    while (stream.peek()) {
        if (stream.match('"""')) {
            state.tokenize = tokenBase
            break
        }
        stream.next()
    }
    return "string"
}

export function tolk() {
    return new LanguageSupport(tolkLanguage)
}
