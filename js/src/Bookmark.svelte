<script>
    import { mark, unmark, marked, info } from './api.js';

    export let uid
    export let currentinfo = info(uid)
    export let textmarked
    export let textunmarked

    let is_marked = marked(uid)

    function toggle() {
        if (marked(uid)) {
            unmark(uid)
        } else {
            mark(uid)
        }
        is_marked = marked(uid)
    }
</script>
<style>
    .marker {
        cursor: pointer;
    }
</style>

<span class="collectivebookmarks marker" on:click={toggle} data-group={currentinfo['group']}>
    {#if is_marked}
        {@html textmarked}
    {:else}
        {@html textunmarked}
    {/if}
</span>
