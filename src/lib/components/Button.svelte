<script lang="ts">
  export let onClick = (e: MouseEvent | KeyboardEvent) => {}
  export let disabled: boolean = false
  export let type: "button" | "submit" | "reset" = "button"
  export let color: "primary" | "secondary" | "tertiary" = "primary"
  export let active: boolean = false
  export let classList: string = "default"

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onClick(e)
    }
  }
</script>

<button
  {type}
  {disabled}
  class:active
  class="{classList} color-{color}"
  on:click={(e) => onClick(e)}
  on:keydown={handleKeydown}
>
  <slot />
</button>

<style lang="sass">

button
  border: none
  cursor: pointer
  border-radius: 1em
  transition: filter 0.2s ease-in-out, background 0.2s ease-in-out
  padding: 0.125em 0.375em
  white-space: nowrap
  overflow: hidden

  &.active
    filter: brightness(1.2)

  &.bare
    background: none

.color-primary
  color: var(--color-primary-1)
  background: var(--color-secondary-3)

.color-secondary
  color: var(--color-secondary-3)
  background: var(--color-primary-1)

.bare
  background: none
  border: none
  padding: 0
  margin: 0

@media (hover: hover)
  button:hover
    filter: brightness(1.05)
  button.active:hover
    filter: brightness(1.2)

</style>
