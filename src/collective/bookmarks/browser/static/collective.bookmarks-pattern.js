// define(
//     'pat-collectivebookmark',
//     [
//     'pat-base',
//     'collective-bookmarks'
//     ], function(Base) {
//     'use strict';
//     var Bookmarks = Base.extend({
//         name: 'collectivebookmark',
//         trigger: '.pat-collectivebookmark',
//         parser: 'mockup',
//         defaults: {
//             textmarked: '&#9733;',
//             textunmarked: '&#9734;',
//             group: 'default',
//             title: '',
//             description: '',
//             imagetag: ''
//         },
//         init: function () {
//             var self = this;
//             var payload = {
//                 title: this.options.title,
//                 description: this.options.description,
//                 imagetag: this.options.imagetag
//             }
//             collectivebookmarks.bindBookmarkOnElement(
//                 this.$el.context,
//                 this.options.uid,
//                 this.options.group,
//                 payload,
//                 this.options.textmarked,
//                 this.options.textunmarked
//             );
//         }
//     });

//     return Bookmarks;
// });

// define(
//     'pat-collectivebookmarklist',
//     [
//     'pat-base',
//     'collective-bookmarks'
//     ], function(Base) {
//     'use strict';
//     var BookmarkList = Base.extend({
//         name: 'collectivebookmarklist',
//         trigger: '.pat-collectivebookmarklist',
//         parser: 'mockup',
//         defaults: {
//         },
//         init: function () {
//             var self = this;
//             collectivebookmarks.bindBookmarkListOnElement(this.$el.context);
//         }
//     });

//     return BookmarkList;
// });
// define(
//     'pat-collectivebookmarksum',
//     [
//     'pat-base',
//     'collective-bookmarks'
//     ], function(Base) {
//     'use strict';
//     var BookmarkSum = Base.extend({
//         name: 'collectivebookmarksum',
//         trigger: '.pat-collectivebookmarksum',
//         parser: 'mockup',
//         defaults: {
//         },
//         init: function () {
//             var self = this;
//             collectivebookmarks.bindBookmarkSumOnElement(this.$el.context);
//         }
//     });

//     return BookmarkSum;
// });

// require(["pat-registry", "pat-collectivebookmark", "pat-collectivebookmarklist", "pat-collectivebookmarksum"], function(reg) {
//     reg.init();
// });
