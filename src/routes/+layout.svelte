<script>
  import "/src/styles/app.sass"
  import "shown/src/css/shown.css"

  import Header from "$lib/components/Header.svelte"
  import Menu from "$lib/components/Menu.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"
  import ModalOrientation from "$lib/components/ModalOrientation.svelte"
</script>

<slot />

<Menu />
<ModalShare />
<ModalOrientation />
