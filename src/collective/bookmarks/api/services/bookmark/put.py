# from plone import api
from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_bookmark_from_request
from collective.bookmarks.storage import Bookmarks
from plone.protect.interfaces import IDisableCSRFProtection
from plone.restapi.services import Service
from zExceptions import BadRequest
from zExceptions import MethodNotAllowed
from zope.interface import alsoProvides


class BookmarkPut(Service):
    def reply(self):
        owner, uid, group, payload = get_bookmark_from_request(
            self.request, loadjson=True
        )
        alsoProvides(self.request, IDisableCSRFProtection)
        payload = self.request.form.get("payload", "{}")
        bookmarks = Bookmarks()
        bookmark = bookmarks.update(owner, uid, group, payload)
        if not bookmark:
            # be kind
            bookmark = bookmarks.add(owner, uid, group, payload)
        self.request.response.setStatus(201)
        return bookmark_dict_to_json_dict(bookmark)
