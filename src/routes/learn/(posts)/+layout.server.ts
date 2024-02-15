import { base } from "$app/paths"

import articles from "$lib/data/articles"

export async function load({ url }) {
  const slug = url.pathname
  const post = articles.find((post) => slug === `${base}/learn/${post.slug}`)

  // TODO: add 404 handling

  return { post }
}
