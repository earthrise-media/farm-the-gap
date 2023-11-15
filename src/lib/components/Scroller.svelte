<script lang="ts">
  export let classList = ""
  export let direction = "y"
</script>

<div class="scroller">
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
</style>
