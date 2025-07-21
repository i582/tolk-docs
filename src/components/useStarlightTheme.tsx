import {useEffect, useState} from "react"

export function useStarlightTheme() {
    const [theme, setTheme] = useState(() => document.documentElement.dataset.theme ?? "auto")

    useEffect(() => {
        const root = document.documentElement

        const obs = new MutationObserver(() => setTheme(root.dataset.theme ?? "auto"))
        obs.observe(root, {attributes: true, attributeFilter: ["data-theme"]})

        const onStorage = (e: StorageEvent) => {
            if (e.key === "starlight-theme") {
                setTheme(e.newValue ?? "auto")
            }
        }
        window.addEventListener("storage", onStorage)

        return () => {
            obs.disconnect()
            window.removeEventListener("storage", onStorage)
        }
    }, [])

    return theme as "light" | "dark" | "auto"
}
