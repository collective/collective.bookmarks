from plone import api
from zExceptions import BadRequest

import json
import uuid


def get_bookmark_from_request(request, loadjson=False):
    if loadjson:
        request.stdin.seek(0)
        data = json.load(request.stdin)
    else:
        data = request.form
        if "payload" in data:
            data["payload"] = json.loads(data["payload"])
    uid = data.get("uid", None)
    if not uid:
        raise BadRequest("Property 'uid' is required")
    try:
        uid = uuid.UUID(uid)
    except ValueError as exc:
        raise BadRequest(f"Property 'uid' is malformed: {exc}")

    group = data.get("group", "")
    owner = data.get("owner", None)
    if owner is None:
        owner = api.user.get_current().getId()
        if owner is None:
            raise BadRequest(f"Property 'owner' is mandatory for anonymous users.")
    return owner, uid, group, data.get('payload', {})


def bookmark_dict_to_json_dict(bookmark):
    bookmark["@type"] = "collective.bookmarks.bookmark"
    bookmark["uid"] = str(bookmark["uid"])
    return bookmark
