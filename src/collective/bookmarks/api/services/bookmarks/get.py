from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_owner
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import NotFound


class BookmarksGet(Service):
    def reply(self):
        owner = get_owner(request=self.request)
        bookmarks = Bookmarks()
        bookmarks = bookmarks.by_owner(owner)
        if not bookmarks:
            raise NotFound("No such bookmark found.")
        result = []
        for bookmark in bookmarks:
            result.append(bookmark_dict_to_json_dict(bookmark))
        return result
