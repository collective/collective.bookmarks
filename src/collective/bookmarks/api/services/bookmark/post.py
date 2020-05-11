# -*- coding: utf-8 -*-
# from plone import api
from collective.bookmarks.api.utils import bookmark_dict_to_json_dict
from collective.bookmarks.api.utils import get_triple_from_request
from collective.bookmarks.storage import Bookmarks
from plone.restapi.services import Service
from zExceptions import BadRequest
from zExceptions import MethodNotAllowed

import json


class BookmarkPost(Service):
    def reply(self):
        owner, uid, group = get_triple_from_request(self.request)
        payload = self.request.form.get("payload", "{}")
        try:
            payload = json.loads(payload)
        except ValueError as exc:
            raise BadRequest(f"Property 'uid' is malformed JSON: {exc}")
        bookmarks = Bookmarks()
        bookmark = bookmarks.add(owner, uid, group, payload)
        if not bookmark:
            # existing
            self.request.response.setStatus(201)
            raise MethodNotAllowed(
                f"Given triple owner, uid and group exists, use PUT to update."
            )
        self.request.response.setStatus(201)
        return bookmark_dict_to_json_dict(bookmark)
