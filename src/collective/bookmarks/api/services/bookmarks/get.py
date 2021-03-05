from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_owner
from collective.bookmarks.storage import Bookmarks
from plone import api
from plone.restapi.services import Service


class BookmarksGet(Service):
    def reply(self):
        """get bookmarks by

        owner
        group (optional)
        """
        owner = get_owner(request=self.request)
        bookmarks = Bookmarks()
        bookmarks = bookmarks.by_owner(owner, group=None)
        # no bookmarks is no error.
        # if not bookmarks:
        #     raise NotFound("No such bookmark found.")
        result = []
        for bookmark in bookmarks:
            if api.content.find(UID=bookmark["uid"].hex):
                result.append(bookmark_dict_to_json_dict(bookmark))
        return result
