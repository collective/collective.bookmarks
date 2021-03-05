from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.services import Service
from zope.interface import alsoProvides


class BookmarkPost(Service):
    def reply(self):
        """add bookmark by

        uid
        owner
        group
        queryparams (optional): serialized querystring

        Update bookmark if bookmark with identifier set found.
        """
        owner, uid, group, queryparams, payload = get_bookmark_from_request(
            self.request, loadjson=True
        )
        alsoProvides(self.request, IDisableCSRFProtection)
        bookmarks = Bookmarks()
        bookmark = bookmarks.add(owner, uid, group, queryparams, payload)
        if not bookmark:
            # be kind
            bookmark = bookmarks.update(owner, uid, group, queryparams, payload)
        self.request.response.setStatus(201)
        return bookmark_dict_to_json_dict(bookmark)
