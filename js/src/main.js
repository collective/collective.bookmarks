import Bookmark from './Bookmark.svelte';

function bind(markerClass) {
    for (const element of document.getElementsByClassName(markerClass)) {
        const bookmark = new Bookmark({
            target: element,
            props: {
                uid: element.dataset.uid,
            }
        });
    }
}
export { Bookmark, bind }
