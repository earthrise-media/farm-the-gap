<script lang="ts">
  export let classList = ""
  export let direction = "y"
  export let gradient = false
</script>

<div class="scroller">
  {#if gradient}
    <div class="gradient" />
  {/if}
  <div class="scroller-contents scroller-{direction} {classList} {direction === 'y' ? 'pr-4' : ''}">
    <slot />
  </div>
</div>

<style lang="sass">

.scroller
  display: flex
  overflow: hidden
  position: relative
  flex-direction: column
  scroll-behavior: smooth
  flex-grow: 1
  height: 100%

.scroller-contents
  height: inherit
  position: relative
  overscroll-behavior: contain
  padding: 0.125rem

  &.bg-fill
    border-radius: 0.75rem
    padding: 0.75rem

  &.scroller-y
    overflow: hidden auto
  
    &::-webkit-scrollbar
      width: 2px
    
  &.scroller-x
    overflow: auto hidden
    
    &::-webkit-scrollbar
      height: 2px

  &::-webkit-scrollbar-track
    background: none

  &::-webkit-scrollbar-thumb
    background: var(--color-secondary-3)


.gradient
  position: absolute
  left: 0
  right: 0
  bottom: 0
  top: calc(100% - 1.5rem)
  pointer-events: none
  background: linear-gradient(180deg, var(--color-primary-2-alpha-0) 0%, var(--color-primary-2) 100%)
  z-index: 1
  opacity: 1
</style>
