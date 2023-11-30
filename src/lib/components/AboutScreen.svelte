<script lang="ts">
  import Modal from "$lib/components/Modal.svelte"
  import { userState } from "$lib/stores/state"

  $: console.log(userState.showAboutPage)
</script>

{#if $userState.showAboutPage}
  <Modal fullscreen close={() => ($userState.showAboutPage = false)}>
    <h1 class="title">About</h1>
    <p>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde nihil qui non neque ducimus?
      Omnis molestias error, sapiente laborum impedit tempore eum, hic ex architecto distinctio
      inventore, excepturi libero ipsa dolor fugiat in fugit totam veritatis autem est? Tenetur enim
      veniam atque velit inventore facere beatae modi dolorum, labore aliquam?
    </p>
  </Modal>
{/if}
