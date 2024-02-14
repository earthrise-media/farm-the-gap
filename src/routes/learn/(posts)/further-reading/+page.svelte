<script lang="ts">
  import posts from "./posts.json"
</script>

{#each posts as { title, url, description }, i}
  <a target="_blank" href={url}>
    <b>{title}</b>:
    {description}
  </a>
{/each}
