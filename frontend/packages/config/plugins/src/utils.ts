import { type HtmlTagDescriptor } from "vite"

const injectDataToWindow = <T extends object>(data: T): HtmlTagDescriptor[] => {
    const scriptContent = Object.entries(data).map(([key, val]) => {
        return `window.${key} = ${JSON.stringify(val)}`
    })
    return [
        {
            tag: 'script',
            attrs: { type: 'text/javascript' },
            children: `\n${scriptContent.join("\n")}\n`,
            injectTo: 'head-prepend',
        }
    ]
}

const injectFontsPreloaderToHtml = (sourcesArr: string[]): HtmlTagDescriptor[] => {
    return sourcesArr.map((source) => ({
        tag: "link",
        attrs: { rel: "preload", href: source, as: "font", type: "font/woff2", crossorigin: "anonymous" },
        injectTo: "head"
    }))
}

export { injectDataToWindow, injectFontsPreloaderToHtml };