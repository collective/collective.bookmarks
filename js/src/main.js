import Bookmark from './Bookmark.svelte';

function bindOnElement(element, uid, group, textmarked="&#9733;", textunmarked="&#9734;") {
    const bookmark = new Bookmark({
        target: element,
        props: {
            'uid': uid,
            'group': group,
            'textmarked': textmarked,
            'textunmarked': textunmarked,
        }
    });
}

function bindByClass(markerClass, uidkey, groupkey) {
    for (const element of document.getElementsByClassName(markerClass)) {
        bindOnElement(element, element.dataset[uidkey], element.dataset[groupkey])
    }
}

export { bindOnElement, bindByClass }
