<script lang="ts">
  import { groups } from "./posts"
</script>

{#each groups as { heading, posts }}
  <h2>{heading}</h2>
  {#each posts as { title, author, url, description }, i}
    <a target="_blank" href={url}>
      <div class="label-caps">{author}</div>
      <div class="link-title bold">{title}</div>
      {#if description}
        <div class="description label">{description}</div>
      {/if}
    </a>
  {/each}
{/each}

<style lang="sass">
a
  display: flex
  flex-direction: column
  margin-bottom: 1em
  text-decoration: none
  transition: background 0.2s
  padding: var(--border-radius)
  border-radius: var(--border-radius)
  background: var(--color-secondary-2)

@media (hover: hover)
  a:hover
    background: var(--color-secondary-3)
</style>
