<script lang="ts">
  import type { Strategy } from "./data"

  export let cards: Strategy[]
</script>

<figure>
  <ul>
    {#each cards as { title, summary, potential, highlight }, i}
      <li class="flex-1" class:highlight>
        <div class="bold">{i + 1}. {title}</div>
        <div class="summary label">{summary} <b>Potential:</b>&nbsp;{potential}</div>
      </li>
    {/each}
  </ul>
</figure>

<style lang="sass">
ul
  display: flex
  flex-direction: column
  gap: 1rem
  font-size: 0.875rem

.label
  font-size: 0.75rem

.highlight
  background: rgba(white, 0.25)
  border: 1px dashed var(--color-tertiary-1)
  border-radius: 4px
  padding: 0.25rem 0.5rem
</style>
