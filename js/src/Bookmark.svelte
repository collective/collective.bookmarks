<script>
    import { mark, unmark, marked } from './api.js';
    import { CRUDL } from "./restapi.js"

    export let uid
    export let group
    export let textmarked
    export let textunmarked

    CRUDL.read(uid)

    let is_marked = marked(uid)


    function toggle() {
        if (marked(uid)) {
            unmark(uid)
        } else {
            mark(uid, group)
        }
        is_marked = marked(uid)
    }
</script>
<style>
    .marker {
        cursor: pointer;
    }
</style>

<span class="collectivebookmarks marker" on:click={toggle}>
    {#if is_marked}
        {@html textmarked}
    {:else}
        {@html textunmarked}
    {/if}
</span>
