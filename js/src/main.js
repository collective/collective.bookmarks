import Bookmark from './Bookmark.svelte';
import BookmarkList from './BookmarkList.svelte';
import BookmarkSum from './BookmarkSum.svelte';



// function initBookmarkElements() {
//   let bookmark_element_targets = document.getElementsByTagName("bookmark-element");
//   for(let i = 0;i < bookmark_element_targets.length; i++){
//     let target = bookmark_element_targets[i]

//     let attrs = target.getAttributeNames();
//     let props = [];
//     for (let attr of attrs) {
//       let value = target.getAttribute(attr);
//       if (!value) {
//         continue;
//       }
//       let propName = attr;
//       props[propName] = value;
//     }

//     const bookmark_element = new Bookmark({
//         target: target,
//         props: props,
//     });
//   }
// }

// initBookmarkElements();

// let bookmark_list_targets = document.getElementsByTagName("bookmark-list");
// for(let i = 0;i < bookmark_list_targets.length; i++){
//   let target = bookmark_list_targets[i]
//   const bookmark_list = new BookmarkList({
//       target: target,
//       props: {}
//   });
// }


// let bookmark_sum_targets = document.getElementsByTagName("bookmark-sum");
// for(let i = 0;i < bookmark_sum_targets.length; i++){
//   let target = bookmark_sum_targets[i]
//   const bookmark_sum = new BookmarkSum({
//       target: target,
//       props: {}
//   });
// }
