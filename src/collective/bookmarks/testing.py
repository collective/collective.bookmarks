from plone.app.contenttypes.testing import PLONE_APP_CONTENTTYPES_FIXTURE
from plone.app.testing import applyProfile
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer

import collective.bookmarks


class CollectiveBookmarksLayer(PloneSandboxLayer):

    defaultBases = (PLONE_APP_CONTENTTYPES_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        # Load any other ZCML that is required for your tests.
        # The z3c.autoinclude feature is disabled in the Plone fixture base
        # layer.
        import plone.restapi

        self.loadZCML(package=plone.restapi)
        self.loadZCML(package=collective.bookmarks)

    def setUpPloneSite(self, portal):
        applyProfile(portal, "collective.bookmarks:default")


COLLECTIVE_BOOKMARKS_FIXTURE = CollectiveBookmarksLayer()


COLLECTIVE_BOOKMARKS_INTEGRATION_TESTING = IntegrationTesting(
    bases=(COLLECTIVE_BOOKMARKS_FIXTURE,),
    name="CollectiveBookmarksLayer:IntegrationTesting",
)


COLLECTIVE_BOOKMARKS_FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(COLLECTIVE_BOOKMARKS_FIXTURE,),
    name="CollectiveBookmarksLayer:FunctionalTesting",
)
