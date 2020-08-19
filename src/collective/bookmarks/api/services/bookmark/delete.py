# -*- coding: utf-8 -*-
from collective.bookmarks.api.utils import get_triple_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import BadRequest


class BookmarkDelete(Service):
    def reply(self):
        owner, uid, group = get_triple_from_request(self.request)
        bookmarks = Bookmarks()
        bookmark = bookmarks.delete(owner, uid, group)
        if bookmark:
            return self.reply_no_content()
        raise BadRequest("No such bookmark found.")
