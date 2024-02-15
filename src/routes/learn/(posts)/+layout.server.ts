import { base } from "$app/paths"

import articles from "$lib/data/articles"

export async function load({ url }) {
  console.log("URL", url.pathname)

  const slug = url.pathname
  const post = articles.find((post) => slug === `${base}/learn/${post.slug}`)

  return { post }
}
