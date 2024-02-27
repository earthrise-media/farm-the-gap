<script lang="ts">
  import { userState } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Modal from "$lib/components/Modal.svelte"

  const platforms = [
    {
      name: "Twitter",
      url: "https://twitter.com/intent/tweet?text=",
      icon: "twitter",
      color: "#141414"
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
      name: "Whatsapp",
      url: `https://wa.me/?text=`,
      icon: "whatsapp",
      color: "#25d366",
      mobileOnly: true
    },
    {
      name: "Email",
      url: "mailto:?subject=The%20Plotline&body=",
      icon: "mail",
      color: "#141414"
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
      {#each platforms as { name, url, icon, color, mobileOnly }}
        <a
          class="button-share"
          href="{url}{$userState.shareText}"
          target="_blank"
          rel="noopener noreferrer"
          style="background-color: {color}"
          data-tooltip={name}
          class:mobile-only={mobileOnly}
        >
          {#if icon}
            <Icon classList="text-xl" type={icon} fillRule="evenodd" />
          {:else}
            {name.slice(0, 1)}
          {/if}
        </a>
      {/each}
    </div>
  </Modal>
{/if}

<style lang="sass">
@import "src/styles/vars/screens"

.buttons
  display: flex
  justify-content: center
  gap: 0.75em
  color: var(--color-secondary-1)
  font-weight: bold
  flex-grow: 1

.button-share
  padding: 0
  text-decoration: none
  display: flex
  align-items: center
  justify-content: center
  border-radius: 50rem
  height: 2.5rem
  width: 2.5rem

  &.mobile-only
    @media (min-width: calc($screen-sm + 1px))
      display: none

</style>
