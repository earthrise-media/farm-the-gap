<script lang="ts">
  import { userState } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import Button from "$lib/components/Button.svelte"

  const platforms = [
    {
      name: "Twitter",
      url: "https://twitter.com/intent/tweet?text=",
      icon: "twitter",
      color: "#1DA1F2"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/sharer/sharer.php?u=",
      icon: "facebook",
      color: "#4267B2"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/shareArticle?mini=true&url=",
      icon: "linkedin",
      color: "#0077B5"
    },
    {
      name: "Reddit",
      url: "https://reddit.com/submit?url=",
      icon: "reddit",
      color: "#FF4500"
    },
    {
      name: "Email",
      url: "mailto:?subject=The%20Plotline&body=",
      icon: "mail",
      color: "#000"
    }
  ]
</script>

{#if $userState.shareText}
  <Modal
    id="modal-share"
    close={(e) => {
      $userState.shareText = ""
      e.stopPropagation()
    }}
  >
    <div slot="title">Share</div>
    <p>{$userState.shareText}</p>
    <div class="buttons">
      {#each platforms as { name, url, icon, color }}
        <a
          class="button-share"
          href="{url}{$userState.shareText}"
          target="_blank"
          rel="noopener noreferrer"
          style="background-color: {color}"
          data-tooltip={name}
        >
          <i class="icon icon-{icon}" />
          {name.slice(0, 1)}
        </a>
      {/each}
    </div>
  </Modal>
{/if}

<style lang="sass">
.buttons
  display: flex
  justify-content: center
  gap: 1em
  color: var(--color-secondary-1)
  font-weight: bold

.button-share
  padding: 1em
  text-decoration: none
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50rem
  height: 2em
  width: 2em

</style>
