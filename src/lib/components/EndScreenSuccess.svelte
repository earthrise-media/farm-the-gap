<script lang="ts">
  import Button from "$lib/components/Button.svelte"
  import Farm from "$lib/components/Farm.svelte"

  export let reset = () => {}
</script>

<div class="farm-container">
  <Farm levitate />
</div>
<div class="flex buttons">
  <Button
    color="primary"
    target="_blank"
    link="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    onClick={reset}
    >Share
  </Button>
  <Button color="secondary" onClick={reset}>Play again</Button>
</div>

<style lang="sass">
.farm-container
  position: relative
  max-width: 400px
</style>
