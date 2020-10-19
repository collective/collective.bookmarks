<script>
import store from './store.js'

export let uid
export let group
export let payload
export let textmarked
export let textunmarked


function toggle(event) {
    if ($store.get(uid+group)) {
        store.delete(uid, group)
    } else {
        store.add(uid, group, payload)
    }
}

</script>
<style>
    .marker {
        cursor: pointer;
    }
</style>

<span class="collectivebookmarks marker" on:click={toggle}>
    {#if ($store.get(uid+group)) }
        {@html textmarked}
    {:else}
        {@html textunmarked}
    {/if}
</span>
