<script>
import { afterUpdate } from 'svelte';
import store from './store.js'

const sum = (storage) => {
    return storage.size
}

afterUpdate(() => {
    let event = new
    Event('collective.bookmarks.sum.updated')
    document.dispatchEvent(event)
});

</script>
<style>
</style>


<svelte:options tag="bookmark-sum" />

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
