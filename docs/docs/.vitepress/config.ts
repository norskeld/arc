import shiki from 'shiki'
import type { DefaultTheme, HeadConfig, MarkdownOptions } from 'vitepress'
import { defineConfig } from 'vitepress'

import pkg from '../../../package.json'

import { Content, Nav, Sidebar, Social, capitalize, format } from './helpers'
import { Github, Npm } from './icons'

const GH_URL = 'https://github.com/norskeld/sigma'
const NPM_URL = 'https://npm.im/@nrsk/sigma'

import { dirname, join } from 'path'
import ts from 'typescript'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

type Params = {
  name: string | undefined
  type: string
  text: string
}

type ExtractedSignature = {
  description: string
  name: string
  params: Params[]
  signature: string
  fullText: string
}

type NamedNodes = [string, ts.Node]
/**
 * Prints out particular nodes from a source file
 *
 * @param file a path to a file
 * @param identifiers top level identifiers available
 */
function extract(file: string, identifiers: string[]): ExtractedSignature[] | null {
  // Create a Program to represent the project, then pull out the
  // source file to parse its AST.
  const createdFiles: Record<string, string> = {}

  const options = {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true
  }
  const host = ts.createCompilerHost(options)

  host.writeFile = (fileName: string, contents: string) => (createdFiles[fileName] = contents)
  let program = ts.createProgram([file], options, host)
  program.emit()

  const sourceFile = program.getSourceFile(file)

  // To give constructive error messages, keep track of found and un-found identifiers
  const unfoundNodes: NamedNodes[] = []
  const foundNodes: NamedNodes[] = []

  const dts = file.replace('.ts', '.d.ts')

  // Loop through the root AST nodes of the file
  const dtsSourceFile = ts.createSourceFile(dts, createdFiles[dts], ts.ScriptTarget.ESNext)

  ts.forEachChild(dtsSourceFile, (node) => {
    let name = ''

    // This is an incomplete set of AST nodes which could have a top level identifier
    // it's left to you to expand this list, which you can do by using
    // https://ts-ast-viewer.com/ to see the AST of a file then use the same patterns
    // as below
    if (ts.isFunctionDeclaration(node)) {
      name = node.name?.text!
    } else if (ts.isVariableStatement(node)) {
      name = node.declarationList.declarations[0].name.getText(sourceFile)
    } else if (ts.isInterfaceDeclaration(node)) {
      name = node.name.text
    }

    const container = identifiers.includes(name) ? foundNodes : unfoundNodes

    container.push([name, node])
  })

  // Either print the found nodes, or offer a list of what identifiers were found
  if (!foundNodes.length) {
    console.log(
      `Could not find any of ${identifiers.join(', ')} in ${file}, found: ${unfoundNodes
        .filter((f) => f[0])
        .map((f) => f[0])
        .join(', ')}.`
    )
    process.exitCode = 1
  } else {
    return foundNodes.map((f) => {
      const [name, node] = f
      // Extremely dirty but works
      const [jsDoc] = 'jsDoc' in node ? (node.jsDoc as [ts.JSDoc]) : []
      const description = jsDoc?.comment as string

      const params = jsDoc?.tags?.map((tag) => {
        return {
          name: (tag as ts.JSDocParameterTag).name,
          text: tag.getFullText(sourceFile),
          type: tag.tagName.text
        }
      })

      const fullText = node.getFullText(sourceFile)
      const signature = node.getText(dtsSourceFile)

      // console.log('### ' + name + '\n')
      // console.log(printer.printNode(ts.EmitHint.Unspecified, node, sourceFile!))
      //   + '\n'

      return {
        description,
        name,
        params,
        signature,
        fullText
      }
    })
  }
  return null
}

// Run the extract function with the script's arguments

export default defineConfig({
  lang: 'en-US',
  title: 'Sigma',
  titleTemplate: false,
  description: 'TypeScript parser combinator library for building fast and convenient parsers.',

  lastUpdated: true,

  outDir: '../dist',
  srcDir: './content',
  cacheDir: '../cache',

  cleanUrls: true,

  head: getHeadConfig(),
  markdown: getMarkdownConfig(),
  themeConfig: getThemeConfig(),
  async transformPageData(pageData, { siteConfig }) {
    if (pageData.title === 'attempt') {
      const result = extract(
        join(__dirname, '../../../', `./src/combinators/${pageData.title}.ts`),
        // This will not work when method is not equal the name
        [pageData.title]
      )

      if (!result) {
        return
      }

      const data = result[0].signature.replace('export', '').replace('declare', '').trim()

      const highlighter = await shiki.getHighlighter({
        theme: 'nord'
      })

      const lang = 'ts'
      const styleRE = /<pre[^>]*(style=".*?")/
      const preRE = /^<pre(.*?)>/
      const vueRE = /-vue$/
      const vPre = vueRE.test(lang) ? '' : 'v-pre'

      const cleanup = (str: string) => {
        return str
          .replace(
            preRE,
            (_, attributes) => `<pre ${vPre}${attributes.replace(' tabindex="0"', '')}>`
          )
          .replace(styleRE, (_, style) => _.replace(style, ''))
      }
      const code = cleanup(highlighter.codeToHtml(data, { lang }))
      const template = `<div class="language-${lang}"><button title="Copy Code" class="copy"></button><span class="lang">${lang}</span>${code}</div>`
      pageData.data = template
    }
  }
})

function getHeadConfig(): Array<HeadConfig> {
  return [
    // Additional link tags.
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/favicon/apple-touch-icon.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon/favicon-32x32.png'
      }
    ],
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon/favicon-16x16.png'
      }
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        color: '#5bbad5',
        href: '/favicon/safari-pinned-tab.svg'
      }
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/favicon/site.webmanifest'
      }
    ],
    // Additional meta tags.
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff'
      }
    ],
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      }
    ]
  ]
}

function getMarkdownConfig(): MarkdownOptions {
  return {
    theme: 'nord'
  }
}

function getThemeConfig(): DefaultTheme.Config {
  return {
    logo: {
      light: '/images/logo-light.svg',
      dark: '/images/logo-dark.svg'
    },

    editLink: {
      text: 'Edit this page on GitHub',
      pattern: `${GH_URL}/edit/master/docs/docs/content/:path`
    },

    nav: getNav(),
    footer: getFooter(),
    sidebar: getSidebar(),
    socialLinks: getSocialLinks(),

    search: {
      provider: 'local'
    },
    data: {
      attempt: 'function attempt<T>(parser: Parser<T>): Parser<T>'
    }
  }
}

function getNav() {
  const items = getSidebar().flatMap((item) => item.items ?? [])

  const [core] = items.filter((item) => item.link?.startsWith('/core') ?? false)
  const [combinators] = items.filter((item) => item.link?.startsWith('/combinators') ?? false)
  const [parsers] = items.filter((item) => item.link?.startsWith('/parsers') ?? false)

  return [
    Nav.item('Core', core.link!),
    Nav.item('Combinators', combinators.link!),
    Nav.item('Parsers', parsers.link!),
    Nav.items(pkg.version, [Nav.item('Changelog', GH_URL + '/blob/master/CHANGELOG.md')])
  ]
}

function getSocialLinks() {
  return [Social.item(Github, GH_URL), Social.item(Npm, NPM_URL)]
}

function getSidebar() {
  const contentDir = Content.getContentDir()

  return Content.getContentFolders(contentDir).map((folder) =>
    Sidebar.group(capitalize(folder), `/${folder}`, Content.getItems(`${contentDir}/${folder}`))
  )
}

function getFooter() {
  return {
    message: format(
      `Built with <a href="https://vitepress.vuejs.org/">VitePress</a>`,
      ` &middot; `,
      `<a href="${GH_URL}/tree/master/docs">Source code</a>`
    ),

    copyright: format(
      `&copy; 2021-present`,
      ` &middot; `,
      `Licensed under <a href="${GH_URL}/blob/master/LICENSE">MIT</a>`
    )
  }
}
