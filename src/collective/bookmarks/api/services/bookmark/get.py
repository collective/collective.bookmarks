# -*- coding: utf-8 -*-
from plone import api
from plone.restapi.interfaces import IExpandableElement
from plone.restapi.services import Service
from zope.component import adapter
from zope.interface import implementer
from zope.interface import Interface


@implementer(IExpandableElement)
@adapter(Interface, Interface)
class Bookmark(object):
    def __init__(self, context, request):
        self.context = context.aq_explicit
        self.request = request

    def __call__(self, expand=False):
        result = {
            "bookmark": {"@id": "{}/@bookmark".format(self.context.absolute_url(),),},
        }
        if not expand:
            return result

        return result


class BookmarkGet(Service):
    def reply(self):
        service_factory = Bookmark(self.context, self.request)
        return service_factory(expand=True)["bookmark"]
