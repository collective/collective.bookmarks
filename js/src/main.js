import Bookmark from './Bookmark.svelte';
import BookmarkList from './BookmarkList.svelte';

function bindBookmarkOnElement(element, uid, group, payload,  textmarked="&#9733;", textunmarked="&#9734;") {
    const bookmark = new Bookmark({
        target: element,
        props: {
            'uid': uid,
            'group': group,
            'textmarked': textmarked,
            'textunmarked': textunmarked,
            'payload': payload
        }
    });
}

function bindBookmarkListOnElement(element) {
    const bookmark = new BookmarkList({
        target: element,
        props: {}
    });
}

export { bindBookmarkOnElement, bindBookmarkListOnElement }
