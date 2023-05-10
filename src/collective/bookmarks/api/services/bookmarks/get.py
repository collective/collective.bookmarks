from AccessControl import getSecurityManager
from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_data_from_request
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
        bmInstance = Bookmarks()

        allusers = self.request.get("allusers", None)
        if allusers:
            sm = getSecurityManager()
            can_view = sm.checkPermission("Manage portal", self.context)        
            if can_view:
                bookmarks = bmInstance.get_all()
            else:
                bookmarks = []
        else:
            owner = get_owner(request=self.request)
            bookmarks = bmInstance.by_owner(owner, group=None)

        result = []
        for bookmark in bookmarks:
            if api.content.find(UID=bookmark["uid"].hex):
                result.append(bookmark_dict_to_json_dict(bookmark))
        return result
