<script>
import store from './store.js'

export let styling = '';
export let layout = '';

const sum = (storage) => {
    return storage.size
}

const groups = (storage) => {
    const groupset = new Set()
    storage.forEach((bookmark) => {
        groupset.add(bookmark['group'])
    })
    return Array.from(groupset).sort()
}
const bookmarks = (group) => {
    const result = Array()
    $store.forEach((bookmark) => {
        if (bookmark['group'] == group) {
            result.push(bookmark)
        }
    })
    return result
}
function handleRemove(uid, group) {
    store.delete(uid, group)
}
</script>
<style>
.remove {
        cursor: pointer;
    }

</style>

<svelte:options tag="bookmark-list" />

<div class="bookmark-list {layout}" data-bookmarks-count="{sum($store)}">
    {@html styling}
    {#if !sum($store)}
        <div class="empty-bookmarks-list"></div>
    {/if}
    {#each groups($store) as group}
    <div class="bookmark-group {group}">
        <div class="group-header">{group}</div>
        <div class="group-list">
            {#each bookmarks(group) as bookmark}
            {#if (bookmark['payload'].title)}
                <div class="bookmark">
                    <a href="resolveuid/{bookmark['uid']}">
                    {#if (bookmark['payload'].imagetag)}
                        <div class="image">{@html bookmark['payload'].imagetag}</div>
                    {/if}
                    </a>

                    {#if (bookmark['payload'].title)}
                        <div class="info">
                            <a href="resolveuid/{bookmark['uid']}">
                                <div class="title">{bookmark['payload'].title}</div>
                                {#if (bookmark['payload'].description)}
                                    <div class="description">{bookmark['payload'].description}</div>
                                {/if}
                            </a>
                            <div class="remove" on:click={() => handleRemove(bookmark['uid'], bookmark['group'])}><span class="placeholder"><span class="label">Remove</span></span></div>
                        </div>
                    {:else}
                        <div class="uid">{bookmark['uid']}</div>
                    {/if}
                </div>
            {/if}
            {/each}
        </div>
    </div>
    {/each}
</div>
