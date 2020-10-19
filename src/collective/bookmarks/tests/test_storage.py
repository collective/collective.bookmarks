"""Setup tests for this package."""
from collective.bookmarks.testing import COLLECTIVE_BOOKMARKS_INTEGRATION_TESTING

import unittest


class TestStorage(unittest.TestCase):

    layer = COLLECTIVE_BOOKMARKS_INTEGRATION_TESTING

    def test_storage_soup_installed(self):
        from collective.bookmarks.storage import Bookmarks
        from souper.soup import Soup

        bookmarks = Bookmarks()
        self.assertIsInstance(bookmarks._soup, Soup)

    def test_fetch_one_existing(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq
        from souper.soup import Record

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": ""}
        record = Record()
        record.attrs["owner"] = data["owner"]
        record.attrs["uid"] = data["uid"]
        record.attrs["group"] = data["group"]
        bookmarks._soup.add(record)

        result = bookmarks._fetch_one(
            Eq("owner", data["owner"])
            & Eq("uid", data["uid"])
            & Eq("group", data["group"])
        )
        self.assertIs(result, record)

    def test_fetch_one_non_existing(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq

        import uuid

        bookmarks = Bookmarks()
        result = bookmarks._fetch_one(
            Eq("owner", "harry") & Eq("uid", uuid.uuid4()) & Eq("group", "cool stuff")
        )
        self.assertIs(result, None)

    def test_fetch_one_too_many(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq
        from souper.soup import Record

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": ""}
        record1 = Record()
        record1.attrs["owner"] = data["owner"]
        record1.attrs["uid"] = data["uid"]
        record1.attrs["group"] = data["group"]
        record2 = Record()
        record2.attrs["owner"] = data["owner"]
        record2.attrs["uid"] = data["uid"]
        record2.attrs["group"] = data["group"]
        bookmarks._soup.add(record1)
        bookmarks._soup.add(record2)

        with self.assertRaises(ValueError):
            bookmarks._fetch_one(
                Eq("owner", data["owner"])
                & Eq("uid", data["uid"])
                & Eq("group", data["group"])
            )

    def test_dictify(self):
        from collective.bookmarks.storage import Bookmarks
        from souper.soup import Record

        import math
        import time
        import uuid

        bookmarks = Bookmarks()
        data = {
            "owner": "kim stanley",
            "uid": uuid.uuid4(),
            "group": "",
            "payload": {},
            "created": math.floor(time.time()),
        }
        record = Record()
        record.attrs["owner"] = data["owner"]
        record.attrs["uid"] = data["uid"]
        record.attrs["group"] = data["group"]
        record.attrs["payload"] = data["payload"]
        record.attrs["created"] = data["created"]

        dictified = bookmarks._dictify(record)
        self.assertEqual(data, dictified)

    def test_add_first(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq

        import math
        import time
        import uuid

        bookmarks = Bookmarks()
        data = {
            "owner": "kim stanley",
            "uid": uuid.uuid4(),
            "group": "",
            "payload": {},
            "created": math.floor(time.time()),
        }
        result = bookmarks.add(
            data["owner"], data["uid"], data["group"], data["payload"]
        )
        self.assertIsNotNone(result)

        record = bookmarks._fetch_one(
            Eq("owner", data["owner"])
            & Eq("uid", data["uid"])
            & Eq("group", data["group"])
        )
        self.assertIn("created", record.attrs)
        record.attrs["created"] = data["created"]
        self.assertEqual(data, bookmarks._dictify(record))

    def test_add_same(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        result1 = bookmarks.add(
            data["owner"], data["uid"], data["group"], data["payload"]
        )
        self.assertIsNotNone(result1)
        result2 = bookmarks.add(
            data["owner"], data["uid"], data["group"], data["payload"]
        )
        self.assertIsNone(result2)

    def test_update_existing(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        bookmarks.add(data["owner"], data["uid"], data["group"], data["payload"])
        new_payload = {"foo": "bar"}
        result = bookmarks.update(
            data["owner"], data["uid"], data["group"], new_payload
        )
        self.assertIsNotNone(result)

        record = bookmarks._fetch_one(
            Eq("owner", data["owner"])
            & Eq("uid", data["uid"])
            & Eq("group", data["group"])
        )
        self.assertEqual(record.attrs["payload"], new_payload)

    def test_update_non_existing(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        new_payload = {"foo": "bar"}
        result = bookmarks.update(
            data["owner"], data["uid"], data["group"], new_payload
        )
        self.assertIsNone(result)

    def test_delete_existing(self):
        from collective.bookmarks.storage import Bookmarks
        from repoze.catalog.query import Eq

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        bookmarks.add(data["owner"], data["uid"], data["group"], data["payload"])
        result = bookmarks.delete(data["owner"], data["uid"], data["group"])
        self.assertIs(result, True)

        record = bookmarks._fetch_one(
            Eq("owner", data["owner"])
            & Eq("uid", data["uid"])
            & Eq("group", data["group"])
        )
        self.assertIsNone(record)

    def test_delete_non_existing(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        result = bookmarks.delete(data["owner"], data["uid"], data["group"])
        self.assertIs(result, False)

    def test_get_existing(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        bookmarks.add(data["owner"], data["uid"], data["group"], data["payload"])
        result = bookmarks.get(data["owner"], data["uid"], data["group"])
        result["created"] = None
        self.assertEqual(
            result,
            {
                "created": None,
                "group": "",
                "owner": "kim stanley",
                "payload": {},
                "uid": data["uid"],
            },
        )

    def test_by_owner(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        bookmarks.add(data["owner"], data["uid"], data["group"], data["payload"])
        bookmarks.add(data["owner"], data["uid"], "chilli", data["payload"])
        bookmarks.add("ian mcdonald", data["uid"], data["group"], data["payload"])

        result = bookmarks.by_owner(data["owner"])
        self.assertEqual(len([x for x in result]), 2)

        result = bookmarks.by_owner(data["owner"], "chilli")
        self.assertEqual(len([x for x in result]), 1)

        result = bookmarks.by_owner("non existing")
        self.assertEqual(len([x for x in result]), 0)

    def test_groups(self):
        from collective.bookmarks.storage import Bookmarks

        import uuid

        bookmarks = Bookmarks()
        data = {"owner": "kim stanley", "uid": uuid.uuid4(), "group": "", "payload": {}}
        bookmarks.add(data["owner"], data["uid"], data["group"], data["payload"])
        bookmarks.add(data["owner"], data["uid"], "chilli", data["payload"])
        bookmarks.add("ian mcdonald", data["uid"], data["group"], data["payload"])

        result = bookmarks.groups(data["owner"])
        self.assertEqual(result, ["", "chilli"])
