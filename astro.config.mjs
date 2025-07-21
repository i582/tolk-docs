// @ts-check
import {defineConfig} from "astro/config"
import starlight from "@astrojs/starlight"
import starlightThemeRapide from "starlight-theme-rapide"
import {ExpressiveCodeTheme} from "@astrojs/starlight/expressive-code"
import fs from "node:fs"

import remarkHeadingId from "remark-custom-heading-id"

import {rehypeHeadingIds} from "@astrojs/markdown-remark"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

import react from "@astrojs/react"

// https://astro.build/config
// https://starlight.astro.build/reference/configuration/
export default defineConfig({
  outDir: "./dist",
  site: "https://i582.github.io",
  base: "/tolk-docs",
  trailingSlash: "always",
  vite: {
    define: {
      global: "globalThis",
    },
    optimizeDeps: {
      include: ["buffer", "@ton/core", "@ton/crypto"],
      exclude: ["@ton/tolk-js", "@ton/sandbox"],
    },
    resolve: {
      alias: {
        buffer: "buffer",
      },
    },
    server: {
      fs: {
        allow: [".."],
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            "tolk-runtime": ["@ton/tolk-js", "@ton/sandbox"],
          },
        },
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkHeadingId],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "append",
          properties: {
            class: "autolink-header",
            ariaHidden: "true",
            ariaLabel: "Link to this header",
            tabIndex: -1,
          },
        },
      ],
    ],
  },
  integrations: [
    starlight({
      title: {
        en: "Tolk Documentation",
      },
      titleDelimiter: undefined,
      favicon: "/favicon.ico",
      logo: {
        dark: "/public/logo-dark.svg",
        light: "/public/logo-light.svg",
        alt: "Tolk Documentation",
        replacesTitle: false,
      },
      // 'head' is auto-populated with SEO-friendly contents based on the page frontmatters
      head: [
        // {
        //     // Google tag (gtag.js)
        //     tag: "script",
        //     attrs: {
        //         async: true,
        //         src: "TODO: Add google analytics link",
        //     },
        // },
        // {
        //     // Per-page Google tag setup
        //     tag: "script",
        //     content:
        //         "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-ZJ3GZHJ0Z5');",
        // },
      ],
      social: {
        github: "https://github.com/ton-blockchain/ton",
        telegram: "https://t.me/tolk_lang",
      },
      editLink: {baseUrl: "https://github.com/ton-blockchain/tolk-docs/edit/main/docs/"},
      tableOfContents: {minHeadingLevel: 2, maxHeadingLevel: 4},
      expressiveCode: {
        themes: [
          "one-dark-pro",
          ExpressiveCodeTheme.fromJSONString(
            fs.readFileSync(new URL(`./themes/one-light-mod.jsonc`, import.meta.url), "utf-8"),
          ),
        ],
        useStarlightDarkModeSwitch: true,
        useStarlightUiThemeColors: true,
        shiki: {
          langs: [
            () => JSON.parse(fs.readFileSync("grammars/grammar-func.json", "utf-8")),
            () => JSON.parse(fs.readFileSync("grammars/grammar-tolk.json", "utf-8")),
            () => JSON.parse(fs.readFileSync("grammars/grammar-tlb.json", "utf-8")),
            () => JSON.parse(fs.readFileSync("grammars/grammar-tasm.json", "utf-8")),
          ],
        },
      },
      customCss: [
        // To adjust Starlight colors and styles
        "./src/starlight.custom.css",
      ],
      plugins: [
        starlightThemeRapide(),
        // TODO: enable
        // starlightLinksValidator({
        //     errorOnFallbackPages: false,
        //     // errorOnInvalidHashes: false,
        // }),
      ],
      credits: false,
      lastUpdated: true,
      disable404Route: false,
      // Note that UI translations are bundled by Starlight for many languages:
      // https://starlight.astro.build/guides/i18n/#translate-starlights-ui
      //
      // To use fallback content and translation notices provided by Starlight,
      // files across language folders must be named the same!
      defaultLocale: "root",
      locales: {
        root: {
          label: "English",
          lang: "en",
        },
      },
      sidebar: [
        {
          label: "Book",
          items: [
            {slug: "book/overview"},
            {slug: "book/language-guide"},
            {slug: "book/environment-setup"},
            {slug: "book/counter-smart-contract"},
            {slug: "book/lazy-loading"},
            {slug: "book/create-message"},
            {slug: "book/pack-to-from-cells"},
            {slug: "book/mutability"},
            {slug: "book/changelog"},
          ],
        },
        {
          label: "Comparison with FunC",
          items: [
            {slug: "book/tolk-vs-func/in-short"},
            {slug: "book/tolk-vs-func/in-detail"},
            {slug: "book/tolk-vs-func/stdlib"},
          ],
        },
        {
          label: "Awesome Tolk",
          link: "https://github.com/ton-blockchain/awesome-tolk",
        },
        {
          label: "Telegram Chat",
          link: "https://t.me/tolk_lang",
          attrs: {target: "_blank"},
        },
      ],
    }),
    react(),
  ],
  redirects: {},
})
