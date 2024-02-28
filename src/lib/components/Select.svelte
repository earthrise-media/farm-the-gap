<script lang="ts">
  export let id: string
  export let name: string
  export let value: any
  export let options: any[] = []
  export let getLabel: (o: any) => any = (o) => o // extract label from option item
  export let getValue: (o: any) => any = (o) => o // extract value from option item
  export let onChange: (e: Event) => void = (e) => {} // handle change event
</script>

<select {id} {name} bind:value on:change={(e) => onChange(e)}>
  {#each options as o}
    <option value={getValue(o)}>{getLabel(o)}</option>
  {/each}
</select>

<style lang="sass">
select
  color: inherit
  background: inherit
  background-color: rgba(white, 0.1)
  border-color: transparent
  border-radius: 1em
  padding: 0 0.125em 0 0.25em
  white-space: nowrap
  font-size: 0.875em
  font-weight: inherit
  cursor: pointer

  &:focus
    outline: none
    border-color: var(--color-tertiary-1)
    

</style>
