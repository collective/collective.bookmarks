<script>
    import { mark, unmark, marked } from './api.js';

    export let uid
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
    .star {
        cursor: pointer;
    }
</style>

<p>
    <span class="star" on:click={toggle}>
        {#if is_marked}
            &#9733;
        {:else}
            &#9734;
        {/if}
    </span>
</p>