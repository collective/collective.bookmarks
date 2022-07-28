Changelog
=========


1.1a2 (unreleased)
------------------

- Return 204 if content is not bookmarked instead of raising NotFound.
  [ksuess]


1.1a1 (2021-03-05)
------------------

- unique identifier changed to (uid, owner, group, queryparams), was before (uid, owner, group). Allows to bookmark searchquery urls.
  [ksuess]
- BREAKING: 'created' in format like plone.restapi does: 
  from plone.restapi.serializer.converters import json_compatible
  [ksuess]
- Convert to custom element
  Various extensions / optimizations
  [jensens]

1.0a1 (unreleased)
------------------

- Initial release.
  [jensens]
