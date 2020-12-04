<script>
  import store from "./store.js";

  export let title = "";
  export let description = "";
  export let imagetag = '';
  export let uid;
  export let group;
  let payload;
  export let textmarked;
  export let textunmarked;

  function toggle(event) {
    if ($store.get(uid + group)) {
      store.delete(uid, group);
    } else {
      store.add(uid, group, payload);
    }
  }

  $: {
    payload = {
      title: title,
      description: description,
      imagetag: imagetag,
    };
  }
</script>

<style>
  .marker {
    cursor: pointer;
  }
</style>

<svelte:options tag="bookmark-element" />

<span class="collectivebookmarks marker" on:click={toggle}>
  {#if $store.get(uid + group)}
    {@html textmarked}
  {:else}
    {@html textunmarked}
  {/if}
</span>
