<script lang="ts">
  import Button from "$lib/components/Button.svelte"
  import Farm from "$lib/components/Farm.svelte"

  export let reset = () => {}
</script>

<p>Congratulations, you closed the food gap!</p>
<Farm levitate />
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
