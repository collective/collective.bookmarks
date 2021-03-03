from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import NotFound


class BookmarkDelete(Service):
    def reply(self):
        """delete bookmark by

        uid
        owner
        group
        queryparams (optional): serialized querystring
        """
        owner, uid, group, queryparams, payload = get_bookmark_from_request(
            self.request, loadjson=True
        )
        bookmarks = Bookmarks()
        bookmark = bookmarks.delete(owner, uid, group, queryparams)
        if bookmark:
            return self.reply_no_content()
        raise NotFound("No such bookmark found.")
