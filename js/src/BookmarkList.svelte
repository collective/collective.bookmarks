<script>
import store from './store.js'

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

<div class="bookmark-list">
    {#each groups($store) as group}
    <div class="bookmark-group {group}">
        <div class="group-header">{group}</div>
        <div class="group-list">
            {#each bookmarks(group) as bookmark}
            {#if (bookmark['payload'].title)}
                <div class="bookmark"><a href="resolveuid/{bookmark['uid']}">
                    {#if (bookmark['payload'].imagetag)}
                        <div class="image">{@html bookmark['payload'].imagetag}</div>
                    {/if}
                    {#if (bookmark['payload'].title)}
                        <div class="title">{bookmark['payload'].title}</div>
                    {:else}
                        <div class="uid">{bookmark['uid']}</div>
                    {/if}
                    </a>
                    {#if (bookmark['payload'].description)}
                        <p class="description">{bookmark['payload'].description}</p>
                    {/if}
                    <span class="remove" on:click={() => handleRemove(bookmark['uid'], bookmark['group'])}>[X]</span>
                </div>
            {/if}
            {/each}
        </div>
    </div>
    {/each}
</div>
