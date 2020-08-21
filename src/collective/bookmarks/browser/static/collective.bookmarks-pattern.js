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
        uid: null,
        init: function () {
        var self = this;
        collectivebookmarks.bindOnElement(this.$el.context, this.options.uid);
        }
    });

    return Bookmarks;
});

require(["pat-registry", "pat-collectivebookmarks"], function(reg) {
    reg.init();
});
