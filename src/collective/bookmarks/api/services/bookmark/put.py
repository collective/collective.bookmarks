# from plone import api
from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.services import Service
from zope.interface import alsoProvides


class BookmarkPut(Service):
    def reply(self):
        """update bookmark by

        uid
        owner
        group
        queryparams (optional): serialized querystring

        Add new bookmark if bookmark not found.
        """
        owner, uid, group, queryparams, payload = get_bookmark_from_request(
            self.request, loadjson=True
        )
        alsoProvides(self.request, IDisableCSRFProtection)
        payload = self.request.form.get("payload", "{}")
        bookmarks = Bookmarks()
        bookmark = bookmarks.update(owner, uid, group, queryparams, payload)
        if not bookmark:
            # be kind
            bookmark = bookmarks.add(owner, uid, group, queryparams, payload)
        self.request.response.setStatus(201)
        return bookmark_dict_to_json_dict(bookmark)
