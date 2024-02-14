import articles from "$lib/data/articles"

export async function load({url}) {
  
  const slug = url.pathname
  const post = articles.find((post) => slug === `/learn/${post.slug}`)

  return { post }
}