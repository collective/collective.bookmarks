import Bookmark from './Bookmark.svelte';

function bindOnElement(element, uid) {
    const bookmark = new Bookmark({
        target: element,
        props: {
            uid: uid,
        }
    });
}

function bindByClass(markerClass, uidkey) {
    for (const element of document.getElementsByClassName(markerClass)) {
        bindOnElement(element, element.dataset[uidkey])
    }
}

export { bindOnElement, bindByClass }
