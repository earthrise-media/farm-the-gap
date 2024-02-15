<script>
  import "/src/styles/app.sass"
  import "shown/src/css/shown.css"

  import Header from "$lib/components/Header.svelte"
  import Menu from "$lib/components/Menu.svelte"
  import Modal from "$lib/components/Modal.svelte"
  import ModalShare from "$lib/components/ModalShare.svelte"
  import ModalOrientation from "$lib/components/ModalOrientation.svelte"
  import Farm from "$lib/components/Farm.svelte"
  import Slide from "$lib/components/Slide.svelte"
</script>

<!-- <slot /> -->

<!-- <Menu />
<ModalShare />
<ModalOrientation /> -->

<Modal fullscreen fullWidth ariaRole="presentation">
  <Slide>
    <div class="flex-col flex-center">
      <div
        class="temp-farm-wrapper"
        style="position: absolute; transform: scale(0.67) translate(0, 0%); top: 2rem;"
      >
        <Farm levitate />
      </div>
      <div class="title" style="margin: 3rem auto 0.25rem;">Protein explorer</div>
      <p>Check back here in March for an exciting digital launch.</p>
      <span>Visit <a href="https://theplotline.org/"><b>The Plotline &nearr;</b></a></span>
    </div>
  </Slide>
</Modal>
