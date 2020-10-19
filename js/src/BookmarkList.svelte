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
</script>
<style>
</style>

<div>
    <h2>Bookmarks</h2>
    {#each groups($store) as group}
    <h2>{group}</h2>
    <ul>
        {#each bookmarks(group) as bookmark}
        <li><a href="resolveuid/{bookmark['uid']}">
            {#if (bookmark['payload'].title)}
                {bookmark['payload'].title}
            {:else}
                {bookmark['uid']}
            {/if}
            </a>
            {#if (bookmark['payload'].description)}
                <p>{bookmark['payload'].description}</p>
            {/if}
        </li>
        {/each}
    </ul>
    {/each}
</div>
