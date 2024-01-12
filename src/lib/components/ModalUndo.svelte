<script lang="ts">
  import { base } from "$app/paths"
  import { gameState } from "$lib/stores/state"

  import Modal from "$lib/components/Modal.svelte"
  import Button from "$lib/components/Button.svelte"
  import ButtonUndo from "$lib/components/ButtonUndo.svelte"

  export let failedMetric: FailureMetric
</script>

<Modal id="modal-undo-warning" hideCloseButton>
  <div class="flex flex-col">
    <div>
      <h2 class="title text-error-1">Heads up!</h2>
      <div class="flex">
        <img src="{base}/img/guide.png" alt="graphic of guide character" />
        <div>
          <p>
            Your last move made
            <span class="bold">
              {failedMetric.label}
            </span>
            <span>
              {failedMetric.value > failedMetric.limit ? "exceed" : "fall under"}
              {failedMetric.suffix === "%" && failedMetric.value > 0
                ? "+"
                : ""}{(failedMetric.suffix === "%" ? 100 : 1) *
                failedMetric.limit}{failedMetric.suffix}.
            </span>
          </p>
          <p>
            Thankfully you have {$gameState.undosRemaining} undo{$gameState.undosRemaining === 1
              ? ""
              : "s"} remaining.
          </p>
          <p>Would you like to undo your last move?</p>
        </div>
      </div>
    </div>
    <ButtonUndo hideRemainingCount>Yes, undo last move ↺</ButtonUndo>
    <Button classList="bold" bare onClick={() => ($gameState.undosRemaining = 0)} color="error"
      >No, let me fail.</Button
    >
  </div>
</Modal>

<style lang="sass">
img
  height: 75px
  margin-right: 1rem

.btn-undo
  width: 100%
  font-size: 1.75rem
  display: flex

:global(#modal-undo-warning .button-undo)
  font-weight: bold
  padding: 2rem 1rem
  margin: 1rem 0

</style>
