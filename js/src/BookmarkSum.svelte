<script>
import { select_multiple_value } from 'svelte/internal'
import store from './store.js'

const sum = (storage) => {
    return storage.size
}
</script>
<style>
</style>
<div>
    {#if (sum($store))}
    <span class="filled">{sum($store)}</span>
    {:else}
    <span class="empty">0</span>
    {/if}
</div>
