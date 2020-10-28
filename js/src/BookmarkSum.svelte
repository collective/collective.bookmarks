<script>
import { afterUpdate } from 'svelte';
import { select_multiple_value } from 'svelte/internal'
import store from './store.js'

const sum = (storage) => {
    return storage.size
}

afterUpdate(() => {
    let event = new
    Event('collective.bookmarks.updated.sum')
    document.dispatchEvent(event)
});

</script>
<style>
</style>
{#if (sum($store))}
<span class="count filled" data-bookmarks-count="{sum($store)}">
    <i class="bookmark-icon" />
    <span class="amount">{sum($store)}</span>
</span>
{:else}
<span class="count empty" data-bookmarks-count="{sum($store)}">
    <i class="bookmark-icon" />
    <span class="amount">0</span>
</span>
{/if}
