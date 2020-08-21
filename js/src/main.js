import Bookmark from './Bookmark.svelte';

function bindOnElement(element, uid, textmarked="&#9733;", textunmarked="&#9734;") {
    const bookmark = new Bookmark({
        target: element,
        props: {
            'uid': uid,
            'textmarked': textmarked,
            'textunmarked': textunmarked,
        }
    });
}

function bindByClass(markerClass, uidkey) {
    for (const element of document.getElementsByClassName(markerClass)) {
        bindOnElement(element, element.dataset[uidkey])
    }
}

export { bindOnElement, bindByClass }
