<script>
  import "/src/styles/app.sass"
  import "shown/src/css/shown.css"

  import ModalShare from "$lib/components/ModalShare.svelte"
</script>

<slot />

<ModalShare />
