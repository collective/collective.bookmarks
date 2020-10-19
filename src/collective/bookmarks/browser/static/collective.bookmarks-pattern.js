define(
    'pat-collectivebookmark',
    [
    'pat-base',
    'collective-bookmarks'
    ], function(Base) {
    'use strict';
    var Bookmarks = Base.extend({
        name: 'collectivebookmark',
        trigger: '.pat-collectivebookmark',
        parser: 'mockup',
        defaults: {
            textmarked: '&#9733;',
            textunmarked: '&#9734;',
            group: 'default',
            title: '',
            description: '',
            imagetag: ''
        },
        init: function () {
            var self = this;
            var payload = {
                title: this.options.title,
                description: this.options.description,
                imagetag: this.options.imagetag
            }
            collectivebookmarks.bindBookmarkOnElement(
                this.$el.context,
                this.options.uid,
                this.options.group,
                payload,
                this.options.textmarked,
                this.options.textunmarked
            );
        }
    });

    return Bookmarks;
});

define(
    'pat-collectivebookmarklist',
    [
    'pat-base'
    ], function(Base) {
    'use strict';
    var BookmarkList = Base.extend({
        name: 'collectivebookmarklist',
        trigger: '.pat-collectivebookmarklist',
        parser: 'mockup',
        defaults: {
        },
        init: function () {
            var self = this;
            collectivebookmarks.bindBookmarkListOnElement(this.$el.context);
        }
    });

    return BookmarkList;
});

require(["pat-registry", "pat-collectivebookmark", "pat-collectivebookmarklist"], function(reg) {
    reg.init();
});
