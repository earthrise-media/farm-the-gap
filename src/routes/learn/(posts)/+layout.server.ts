import { error } from "@sveltejs/kit"
import { base } from "$app/paths"

import articles from "$lib/data/articles"

export async function load({ url }) {
  const slug = url.pathname
  const post = articles.find((post) => slug === `${base}/learn/${post.slug}`)

  if (post) return { post }

  throw error(404, "Page not found")
}
