<script lang="ts">
  import { page } from "$app/stores"
  import { userState } from "$lib/stores/state"

  import Icon from "$lib/components/Icon.svelte"
  import Modal from "$lib/components/Modal.svelte"

  const platforms = [
    {
      name: "Twitter",
      href: "https://twitter.com/intent/tweet?url={{url}}&text={{text}}",
      icon: "twitter",
      color: "#141414"
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/sharer/sharer.php?u={{url}}",
      icon: "facebook",
      color: "#4267B2"
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/sharing/share-offsite/?url={{url}}",
      icon: "linkedin",
      color: "#0077B5"
    },
    {
      name: "Reddit",
      href: "https://reddit.com/submit?url={{url}}&title={{text}}",
      icon: "reddit",
      color: "#FF4500"
    },
    {
      name: "Whatsapp",
      href: `https://wa.me/?text={{text}} {{url}}`,
      icon: "whatsapp",
      color: "#25d366"
    },
    {
      name: "Email",
      href: "mailto:?subject=Check this out&body={{text}} {{url}}",
      icon: "mail",
      color: "#141414"
    }
  ]

  $: url = "https://earthrise-media.github.io/farm-the-gap/" || $page.url.pathname
  $: text = encodeURIComponent($userState.shareText)
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
      {#each platforms as { name, href, icon, color, mobileOnly }}
        <a
          class="button-share"
          href={href.replace("{{url}}", url).replace("{{text}}", text)}
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
