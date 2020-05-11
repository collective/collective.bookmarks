# -*- coding: utf-8 -*-
from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_triple_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import BadRequest


class BookmarkGet(Service):
    def reply(self):
        owner, uid, group = get_triple_from_request(self.request)
        bookmarks = Bookmarks()
        bookmark = bookmarks.get(owner, uid, group)
        if bookmark:
            return bookmark_dict_to_json_dict(bookmark)
        raise BadRequest("No such bookmark found.")
