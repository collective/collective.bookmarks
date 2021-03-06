from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import NotFound


class BookmarkGet(Service):
    def reply(self):
        owner, uid, group, payload = get_bookmark_from_request(self.request)
        bookmarks = Bookmarks()
        bookmark = bookmarks.get(owner, uid, group)
        if bookmark:
            return bookmark_dict_to_json_dict(bookmark)
        raise NotFound("No such bookmark found.")
