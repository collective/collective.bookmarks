from plone import api
from zExceptions import BadRequest

import json
import uuid


def get_data_from_request(request, loadjson):
    if loadjson:
        request.stdin.seek(0)
        return json.load(request.stdin)
    data = request.form
    if "payload" in data:
        data["payload"] = json.loads(data["payload"])
    return data


def get_owner(data=None, request=None, loadjson=None):
    if data is None:
        data = get_data_from_request(request, loadjson)
    owner = data.get("owner", None)
    if owner is None:
        owner = api.user.get_current().getId()
        if owner is None:
            raise BadRequest(f"Property 'owner' is mandatory for anonymous users.")
    return owner


def get_bookmark_from_request(request, loadjson=False):
    data = get_data_from_request(request, loadjson)
    uid = data.get("uid", None)
    if not uid:
        raise BadRequest("Property 'uid' is required")
    try:
        uid = uuid.UUID(uid)
    except ValueError as exc:
        raise BadRequest(f"Property 'uid' is malformed: {exc}")
    group = data.get("group", "")
    owner = get_owner(data=data)
    return owner, uid, group, data.get("payload", {})


def bookmark_dict_to_json_dict(bookmark):
    bookmark["@type"] = "collective.bookmarks.bookmark"
    bookmark["uid"] = str(bookmark["uid"])
    return bookmark
