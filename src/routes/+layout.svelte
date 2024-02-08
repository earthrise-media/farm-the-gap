<script>
  import "/src/styles/app.sass"
  import "shown/src/css/shown.css"

  import Menu from "$lib/components/Menu.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"
  import ModalOrientation from "$lib/components/ModalOrientation.svelte"
</script>

<slot />

<Menu />
<ModalShare />
<ModalOrientation />
