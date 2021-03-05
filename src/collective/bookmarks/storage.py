from datetime import datetime
from plone import api
from plone.restapi.serializer.converters import json_compatible
from repoze.catalog.catalog import Catalog
from repoze.catalog.indexes.field import CatalogFieldIndex
from repoze.catalog.query import Eq
from repoze.catalog.query import Query
from souper.interfaces import ICatalogFactory
from souper.soup import get_soup
from souper.soup import NodeAttributeIndexer
from souper.soup import Record
from zope.interface import implementer

import typing
import uuid


@implementer(ICatalogFactory)
class BookmarksCatalogFactory:
    def __call__(self, context: typing.Union[Record, None] = None) -> Catalog:
        catalog = Catalog()
        catalog["uid"] = CatalogFieldIndex(NodeAttributeIndexer("uid"))
        catalog["group"] = CatalogFieldIndex(NodeAttributeIndexer("group"))
        catalog["created"] = CatalogFieldIndex(NodeAttributeIndexer("created"))
        catalog["owner"] = CatalogFieldIndex(NodeAttributeIndexer("owner"))
        catalog["queryparams"] = CatalogFieldIndex(NodeAttributeIndexer("queryparams"))
        return catalog


class Bookmarks:
    """API to manage booksmarks in the portal"""

    @property
    def _soup(self):
        """get soup storage for bookmarks"""
        soup = getattr(self, "_soup_instance", None)
        if soup is None:
            soup = get_soup("collective_bookmarks", api.portal.get())
            setattr(self, "_soup_instance", soup)
        return soup

    def _fetch_one(self, query: Query) -> typing.Union[Record, None]:
        """fetch a single record from query.

        return None if non-existing
        raises ValueError if no unique single result is found
        """
        lazy_res = self._soup.lazy(query, with_size=True)
        size = next(lazy_res)
        if size > 1:
            raise ValueError(f"Query does not point to a unique result:\n{query}")
        if size == 0:
            return None
        return next(lazy_res)()

    def _dictify(self, record: Record) -> dict:
        result = dict()
        result["owner"] = record.attrs["owner"]
        result["uid"] = record.attrs["uid"]
        result["group"] = record.attrs["group"]
        result["queryparams"] = record.attrs["queryparams"]
        result["created"] = record.attrs["created"]
        result["payload"] = record.attrs["payload"]
        return result

    def add(
        self, owner: str, uid: uuid.UUID, group: str, queryparams: str, payload: dict
    ) -> typing.Union[int, None]:
        """add new entry.

        uniqueness is given by triple of owner, uid, group and queryparams.

        returns None if such a triple already exists
        returns record_id if successful added
        """
        # check existing
        if (
            self._fetch_one(
                Eq("owner", owner)
                & Eq("uid", uid)
                & Eq("group", group)
                & Eq("queryparams", queryparams)
            )
            is not None
        ):
            return None
        record = Record()
        record.attrs["owner"] = owner
        record.attrs["uid"] = uid
        record.attrs["group"] = group
        record.attrs["queryparams"] = queryparams
        record.attrs["payload"] = payload
        record.attrs["created"] = json_compatible(datetime.utcnow())
        if self._soup.add(record):
            return self._dictify(record)

    def update(
        self, owner: str, uid: uuid.UUID, group: str, queryparams: str, payload: dict
    ) -> typing.Union[dict, None]:
        """update payload of an existing entry

        uniqueness is given by triple of owner, uid, group and queryparams.

        returns None if no such a triple already exists
        returns the Record if update was successful
        """
        record = self._fetch_one(
            Eq("owner", owner)
            & Eq("uid", uid)
            & Eq("group", group)
            & Eq("queryparams", queryparams)
        )
        if record is None:
            return None
        record.attrs["payload"] = payload
        return self._dictify(record)

    def delete(self, owner: str, uid: uuid.UUID, group: str, queryparams: str) -> bool:
        """delete existing entry

        uniqueness is given by triple of owner, uid, group and queryparams.

        returns False if no such a triple already exists
        returns True if the Record was successfully deleted
        """
        record = self._fetch_one(
            Eq("owner", owner)
            & Eq("uid", uid)
            & Eq("group", group)
            & Eq("queryparams", queryparams)
        )
        if record is None:
            return False
        del self._soup[record]
        return True

    def get(
        self, owner: str, uid: uuid.UUID, group: str, queryparams: str
    ) -> typing.Union[dict, None]:
        """get one bookmark

        uniqueness is given by triple of owner, uid, group and queryparams.

        returns None if no such a triple already exists
        returns dictified data if update was successful
        """

        record = self._fetch_one(
            Eq("owner", owner)
            & Eq("uid", uid)
            & Eq("group", group)
            & Eq("queryparams", queryparams)
        )
        if record is None:
            return None
        return self._dictify(record)

    def by_owner(
        self, owner: str, group: typing.Union[str, None] = None
    ) -> typing.Iterator[dict]:
        """get all bookmarks of an owner, optional filtered by group

        return dictified data
        """
        query = Eq("owner", owner)
        if group is not None:
            query &= Eq("group", group)
        for lazy_record in self._soup.lazy(query):
            yield self._dictify(lazy_record())

    def groups(self, owner: str) -> typing.List[str]:
        """get all groups of an owner.

        return sorted list of group names
        """
        groups = set()
        for record in self.by_owner(owner):
            groups.add(record["group"])
        return sorted(groups)
