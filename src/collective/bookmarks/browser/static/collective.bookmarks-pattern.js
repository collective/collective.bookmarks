define(
    'pat-collectivebookmarks',
    [
    'pat-base'
    ], function(Base) {
    'use strict';
    var Bookmarks = Base.extend({
        name: 'collectivebookmarks',
        trigger: '.pat-collectivebookmarks',
        parser: 'mockup',
        defaults: {
            textmarked: '&#9733;',
            textunmarked: '&#9734;',
            group: 'default',
        },
        init: function () {
            var self = this;
            collectivebookmarks.bindOnElement(this.$el.context, this.options.uid, this.options.group, this.options.textmarked, this.options.textunmarked);
        }
    });

    return Bookmarks;
});

require(["pat-registry", "pat-collectivebookmarks"], function(reg) {
    reg.init();
});
