<script lang="ts">
  export let onClick = (e: MouseEvent | KeyboardEvent) => {}
  export let onMouseEnter = (e: MouseEvent) => {}
  export let onMouseLeave = (e: MouseEvent) => {}
  export let disabled: boolean = false
  export let type: "button" | "submit" | "reset" = "button"
  export let color: "primary" | "secondary" | "tertiary" | "error" | "error-invert" = "primary"
  export let active: boolean = false
  export let classList: string = "default"
  export let link: string = ""
  export let target: "_blank" | "_self" | "_parent" | "_top" = "_self"
  export let tooltip: string | null = null
  export let bare: boolean = false
  export let attributes = {}

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onClick(e)
    }
  }
</script>

<svelte:element
  this={link ? "a" : "button"}
  href={link}
  {type}
  {target}
  {disabled}
  {...attributes}
  class:bare
  class:active
  class="{classList} color-{color}"
  role="button"
  tabindex="0"
  data-tooltip={tooltip}
  on:click={(e) => onClick(e)}
  on:mouseenter={(e) => onMouseEnter(e)}
  on:mouseleave={(e) => onMouseLeave(e)}
  on:keydown={handleKeydown}
>
  <slot />
</svelte:element>

<style lang="sass">

a, button
  border: none
  cursor: pointer
  border-radius: 1em
  transition: filter 0.2s ease-in-out, background 0.2s ease-in-out
  padding: 0.125em 0.5em
  white-space: nowrap
  overflow: hidden
  font-size: 1em
  text-decoration: none

  &.active
    filter: brightness(1.2)

  &.bare
    background: none

  &:disabled
    cursor: not-allowed
    opacity: 0.5
    filter: saturate(0)

.color-primary
  color: var(--color-primary-1)
  background: var(--color-secondary-3)

.color-secondary
  color: var(--color-secondary-3)
  background: var(--color-primary-1)

.color-tertiary
  color: var(--color-primary-1)
  background: var(--color-tertiary-1)

.color-error
  color: var(--color-error-1)
  background: var(--color-secondary-2)

.color-error-invert
  background: var(--color-error-1)
  color: var(--color-secondary-2)

.bare
  background: none
  border: none
  padding: 0
  margin: 0

@media (hover: hover)
  a:hover,
  button:hover
    filter: brightness(1.05)
  a.active:hover,
  button.active:hover
    filter: brightness(1.2)

</style>
