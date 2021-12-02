import { renderToString } from '@vue/server-renderer'
import { createApp } from './main'

export async function render(url:string, manifest:any) {
  const { app, router } = createApp({ isServer: true })

  router.push(url)
	await router.isReady()

  let ctx:{modules?:any} = {}
  const html = await renderToString(app, ctx)

  if (manifest) {
    const preloadLinks = renderPreloadLinks(ctx.modules, manifest)
    return [html, preloadLinks]
  }

  return [html]
}

function renderPreloadLinks(modules, manifest) {
  let links = ''
  const seen = new Set()
  modules.forEach((id) => {
    const files = manifest[id]
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreloadLink(file)
        }
      })
    }
  })
  return links
}

function renderPreloadLink(file) {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else {
    // TODO
    return ''
  }
}