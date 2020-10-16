from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import NotFound


class BookmarkDelete(Service):
    def reply(self):
        owner, uid, group, payload = get_bookmark_from_request(self.request)
        bookmarks = Bookmarks()
        bookmark = bookmarks.delete(owner, uid, group)
        if bookmark:
            return self.reply_no_content()
        raise NotFound("No such bookmark found.")
