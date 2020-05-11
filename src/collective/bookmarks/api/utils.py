from plone import api
from zExceptions import BadRequest

import uuid


def get_triple_from_request(request):
    uid = request.form.get("uid", None)
    if not uid:
        raise BadRequest("Property 'uid' is required")
    try:
        uid = uuid.UUID(uid)
    except ValueError as exc:
        raise BadRequest(f"Property 'uid' is malformed: {exc}")
    group = request.form.get("group", "")
    owner = request.form.get("owner", None)
    if owner is None:
        owner = api.user.get_current().getId()
        if owner is None:
            raise BadRequest(f"Property 'owner' is mandatory for anonymous users.")
    return owner, uid, group


def bookmark_dict_to_json_dict(bookmark):
    bookmark["@type"] = "collective.bookmarks.bookmark"
    bookmark["uid"] = str(bookmark["uid"])
    bookmark["created"] = bookmark["created"].isoformat()
    return bookmark
